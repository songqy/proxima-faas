import parseSourceStack from './parseSourceStack';
import { runScript } from './ivm';

const render = async (renderData?: Record<string, any>) => {
  const result = await runScript(renderData);
  if (result.stack) {
    result.stack = parseSourceStack(result.stack);
  }

  return result;
};

export default render;
