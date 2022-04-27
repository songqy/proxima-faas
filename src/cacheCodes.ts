import type { CacheCode } from './types';

const cacheCodes: CacheCode = {
  code: '',
};

export const getCacheCodes = () => {
  return cacheCodes;
};

export const setCacheCodes = (value: CacheCode) => {
  cacheCodes.code = value.code;
  cacheCodes.map = value.map;
};
