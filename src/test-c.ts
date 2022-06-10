// 测试isolated-vm编译性能
import ivm from 'isolated-vm';
import fs from 'fs';
import path from 'path';

const MAX_NUM = 10000;
const isolate = new ivm.Isolate({ memoryLimit: 128 });

const getMainScript = (functionName: string) => `
import * as index from 'app';

export async function main() {
  let res;
  try {
    res = await ${functionName}(global.params);
  } catch (e) {
    res = {
      message: e.message,
      stack: e.stack,
    }
  }
  return JSON.stringify(res);
}
`;

export const testComplieMain = async () => {
  for (let i = 0; i < MAX_NUM; ++i) {
    // const mainModule = await isolate.compileModule(
    //   getMainScript('index.render'),
    // );
    const mainModule = await isolate.compileModule('const a = 1');

    mainModule.release();
  }
};

export const testComplieApp = async () => {
  const filename = path.resolve('output/index.js');
  const fileBuffer = await fs.promises.readFile(filename);
  const code = fileBuffer.toString();
  for (let i = 0; i < MAX_NUM; ++i) {
    const appModule = await isolate.compileModule(code, {
      filename,
    });

    appModule.release();
  }
};
