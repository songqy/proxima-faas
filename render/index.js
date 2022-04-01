const ivm = require('isolated-vm');
const fs = require('fs');
const path = require('path');

const isolate = new ivm.Isolate({ memoryLimit: 128 });

const render = async (body) => {
  // const out = require('../output');
  // const outRes = await out(body);
  // console.log(JSON.stringify(outRes));

  const codeBuffer = await fs.promises.readFile(
    path.resolve('output/index.js'),
  );

  const bodyCode = `global.reqData=${JSON.stringify(body)};\n`;
  const codes = bodyCode + codeBuffer.toString();

  const script = await isolate.compileScript(codes);
  const context = isolate.createContextSync();
  const jail = context.global;
  jail.setSync('global', jail.derefInto());
  // jail.setSync('log', function (...args) {
  //   console.log(...args);
  // });

  context.evalClosureSync(
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

  const outRes = await script.run(context, { promise: true }).catch((err) => {
    console.error(err);
  });

  console.log('outRes', outRes);

  return JSON.parse(outRes);
};

module.exports = render;
