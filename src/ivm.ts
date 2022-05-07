import ivm, { Context } from 'isolated-vm';
import path from 'path';
import fetch from './utils/fetch';
import Logger from './utils/logger';
import { MODE } from './utils/constants';
import { getCacheCodes } from './cacheCodes';

const isolate = new ivm.Isolate({ memoryLimit: 512 });

// 入口模块代码
const mainScript = `
import { render } from 'app';

export async function main() {
  let res;
  try {
    res = await render(global.renderData);
  } catch (e) {
    res = {
      message: e.message,
      stack: e.stack,
    }
  }
  return JSON.stringify(res);
}
`;

// 返回一个空的Module
const getEmptyModule = () => isolate.compileModule('');

// 返回应用的模块
const getAppModule = async (context: Context) => {
  const { code } = getCacheCodes();

  const appModule = await isolate.compileModule(code, {
    filename: path.resolve('output/index.js'),
  });
  await appModule.instantiate(context, getEmptyModule);

  return appModule;
};

// 全局变量context
const getContext = (renderData?: Record<string, any>) => {
  const logger = new Logger(MODE.DEV);

  const context = isolate.createContextSync();
  const jail = context.global;
  jail.setSync('global', jail.derefInto());
  // 注入全局变量
  context.evalClosureSync(
    'Object.entries($0).forEach(([ key, val ]) => globalThis[key] = val)',
    [{ renderData }],
    { arguments: { copy: true } },
  );
  // 注入全局方法
  context.evalClosureSync(
    `
      globalThis.console = {log: $1, warn: $2};
      globalThis.setTimeout = (fn, timeout) => $3(new $0.Reference(fn), timeout);
      globalThis.fetch = (url, opts) => $4.apply(null, [url, new $0.Reference(opts)], { result: { promise: true, copy: true } });
    `,
    [
      ivm,
      (...args: any[]) => logger.log(...args),
      (...args: any[]) => logger.warn(...args),
      (fn: any, timeout: number) =>
        void setTimeout(() => fn.applySync(), timeout),
      new ivm.Reference(fetch),
    ],
  );

  return context;
};

export const runScript = async (renderData?: Record<string, any>) => {
  const context = getContext(renderData);
  const appModule = await getAppModule(context);
  // 入口模块
  const mainModule = await isolate.compileModule(mainScript);

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

  // 释放资源
  appModule.release();
  mainModule.release();
  context.release();

  return JSON.parse(result);
};
