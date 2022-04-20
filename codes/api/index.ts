import { AxiosRequestConfig } from 'axios';

type Fetch = (opts?: AxiosRequestConfig) => Promise<any>;

// @ts-ignore
export const fetch = global.fetch as Fetch;
