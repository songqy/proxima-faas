import axios, { AxiosRequestConfig } from 'axios';
import type { Reference } from 'isolated-vm';

const fetch = async (url: string, opts?: Reference<AxiosRequestConfig>) => {
  const { data } = await axios(url, {
    responseType: 'json',
    ...opts.copySync(),
  });
  return data;
};

export default fetch;
