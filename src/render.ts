import path from 'path';

import { IsolateSandbox } from '@nebulare/runtime';

const sanbox = new IsolateSandbox(128);

const render = async (params?: Record<string, any>) => {
  const filename = path.resolve('output');

  return await sanbox.executeApp(filename, 'index.render', params);
};

export default render;
