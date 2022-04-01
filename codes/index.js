import { default as render } from './app';

async function main() {
  const res = await render(global.reqData);
  return JSON.stringify(res);
}

main();
