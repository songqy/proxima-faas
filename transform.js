const swc = require('@swc/core');
const fs = require('fs');
const path = require('path');

const tran = async (code) => {
  return await swc.transform(code, {
    jsc: {
      parser: {
        syntax: 'ecmascript',
        jsx: true,
      },
      transform: {
        react: {
          pragma: 'Px.createElement',
          pragmaFrag: 'Px.Fragment',
        },
      },
      target: 'es2016',
    },
    module: {
      type: 'commonjs',

      // These are defaults.
      strict: false,
      strictMode: true,
      lazy: false,
      noInterop: false,
    },
  });
};

const readSrc = (filename) => {
  return fs.promises.readFile(filename);
};

const readDir = (dirPath) => {
  return fs.promises.readdir(dirPath);
};

const writeSrc = (filename, src) => {
  // console.log('writeSrc',src)
  return fs.promises.writeFile(filename, src);
};

const transform = async () => {
  const dirPath = path.resolve('./codes');
  const res = await readDir(dirPath);
  // console.log('res',res)
  for (const filename of res) {
    const code = await readSrc(path.join(dirPath, filename));
    const codeStr = code.toString();
    const out = await tran(codeStr);
    const fn = filename.replace('jsx', 'js');
    await writeSrc(path.resolve('output', fn), out.code);
  }
};

module.exports = transform;
