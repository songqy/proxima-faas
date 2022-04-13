const ivm = require('isolated-vm');
const fs = require('fs');
const path = require('path');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isolate = new ivm.Isolate({ memoryLimit: 128 });

function noModule(specifier) {
  throw new Error(`Cannot import module '${specifier}'`);
}

const getAppModule = async () => {
  const codeBuffer = await fs.promises.readFile(
    path.resolve('output/index.js'),
  );

  const codes = codeBuffer.toString();

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
      (...args) => console.log(...args),
      (fn, timeout) => void setTimeout(() => fn.applySync(), timeout),
    ],
  );
  // 注入异步方法
  appContext.evalClosure(
    `
      globalThis.fetch = () => $0.apply(null, [], { result: { promise: true } });
    `,
    [
      new ivm.Reference(async () => {
        await sleep(200);
        return 69328;
      }),
    ],
  );

  const appModule = await isolate.compileModule(codes);
  await appModule.instantiate(appContext, noModule);

  return appModule;
};

const render = async (body) => {
  const appModule = await getAppModule();

  // 使用app module
  const context = isolate.createContextSync();
  const jail = context.global;
  jail.setSync('global', jail.derefInto());
  // 注入全局变量
  context.evalClosure(
    'Object.entries($0).forEach(([ key, val ]) => globalThis[key] = val)',
    [{ reqData: body }],
    { arguments: { copy: true } },
  );

  const module = await isolate.compileModule(
    `
      import { render } from 'app';

      export async function main() {
        const res = await render(global.reqData);
        return JSON.stringify(res);
      }
    `,
  );

  await module.instantiate(context, (specifier) => {
    if (specifier === 'app') {
      return appModule;
    }
    throw new Error();
  });
  await module.evaluate();

  const main = await module.namespace.get('main', { reference: true });

  const result = await context.evalClosure(
    `
    return Promise.resolve(($0.deref())());
    `,
    [main],
    { result: { promise: true } },
  );

  return JSON.parse(result);
};

module.exports = render;
