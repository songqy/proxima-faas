import ivm from 'isolated-vm';
import path from 'path';
import axios, { AxiosRequestConfig } from 'axios';
import getSourceStack from './getSourceStack';
import { getCacheCodes } from './cacheCodes';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isolate = new ivm.Isolate({ memoryLimit: 128 });

// 入口模块代码
const mainScript = `
import { render } from 'app';

export async function main() {
  let res;
  try {
    res = await render(global.reqData);
  } catch (e) {
    res = {
      errMessage: e.message,
      stack: e.stack,
    }
  }
  return JSON.stringify(res);
}
`;

// 返回一个空的Module
const getEmptyModule = async () => {
  return await isolate.compileModule('');
};

// 返回应用的模块
const getAppModule = async () => {
  const { code } = getCacheCodes();

  // 构建app module
  const appContext = isolate.createContextSync();
  const jail = appContext.global;
  jail.setSync('global', jail.derefInto());
  // 注入同步方法
  appContext.evalClosureSync(
    `
      globalThis.log = $1
      globalThis.setTimeout = (fn, ...rest) => $2(new $0.Reference(fn), ...rest);
    `,
    [
      ivm,
      (...args: any[]) => console.log(...args),
      (fn: any, timeout: number) =>
        void setTimeout(() => fn.applySync(), timeout),
    ],
  );
  // 注入异步方法
  appContext.evalClosure(
    `
      globalThis.fetch = (opts) => $0.apply(null, [opts], { result: { promise: true } });
    `,
    [
      new ivm.Reference(async (opts: AxiosRequestConfig) => {
        console.log('fetch', opts);
        if (opts) {
          return await axios(opts);
        }
        await sleep(200);
        return 69328;
      }),
    ],
  );

  const appModule = await isolate.compileModule(code, {
    filename: path.resolve('output/index.js'),
  });
  await appModule.instantiate(appContext, getEmptyModule);

  return appModule;
};

const render = async (body?: Record<string, any>) => {
  const appModule = await getAppModule();

  // 入口模块
  const mainModule = await isolate.compileModule(mainScript);

  // 入口模块的全局变量
  const context = isolate.createContextSync();
  const jail = context.global;
  jail.setSync('global', jail.derefInto());
  // 注入全局变量
  context.evalClosure(
    'Object.entries($0).forEach(([ key, val ]) => globalThis[key] = val)',
    [{ reqData: body }],
    { arguments: { copy: true } },
  );

  await mainModule.instantiate(context, async (specifier) => {
    if (specifier === 'app') {
      return appModule;
    }
    return await getEmptyModule();
    // 使用throw会导致错误无法捕捉
    // throw new Error(`Cannot import module '${specifier}'`);
  });
  await mainModule.evaluate();

  const main = await mainModule.namespace.get('main', { reference: true });

  const result = await context.evalClosure(
    'return Promise.resolve(($0.deref())());',
    [main],
    { result: { promise: true } },
  );

  const resObj = JSON.parse(result);
  if (resObj.errMessage) {
    resObj.stack = await getSourceStack(resObj.stack);
  }

  return resObj;
};

export default render;
