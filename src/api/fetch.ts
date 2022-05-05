import got, { OptionsOfJSONResponseBody } from 'got';
import type { Reference } from 'isolated-vm';

const fetch = async (
  url: string,
  opts?: Reference<OptionsOfJSONResponseBody>,
) => {
  const { body } = await got(url, { responseType: 'json', ...opts.copySync() });
  return body;
};

export default fetch;
