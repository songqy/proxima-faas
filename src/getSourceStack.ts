import { decode } from 'vlq';
import { getCacheCodes } from './cacheCodes';
import type { CacheSourceMap } from './types';

const cacheSourceMap: CacheSourceMap = {
  sources: [],
  mappingsCoordinate: [],
};

const readSouceMap = () => {
  const { map } = getCacheCodes();
  return map!;
};

// 两个数字数组相加
const itemPlus = (item1: number[], item2: number[]) => {
  const newItem = [];
  for (let i = 0; i < item1.length; ++i) {
    newItem.push(item1[i] + item2[i]);
  }
  return newItem;
};

/**
 * 解析mapping
 * 一般来说，item是一个4位的数组（如：[0,0,1,5]），不过也可能是5位，
 * item的每一位的含义：
 * 第一位：打包后代码的列数，即y轴
 * 第二位：源码（sources）的索引，即源码的文件名称
 * 第三位：源码的行数，即x轴
 * 第四位：源码的列数，即y轴
 * 第五位：sourcemap中的names的索引
 * 生成的sourcemap中mappings通过vlq的解码后，得到的item都是相对上一个item的的坐标，因此需要相加
 * 加上上一个item坐标后，才能得出真正的item坐标
 */
const decodeMappings = (mappings: string) => {
  const arr: number[][][] = [];
  let lastItem = [0, 0, 0, 0];
  // mappings中通过分号（；）区分打包后代码的行数
  const lines = mappings.split(';');
  for (let l = 0; l < lines.length; ++l) {
    const items = lines[l].split(',');
    if (!items.length || !items[0]) {
      arr.push([]);
      continue;
    }
    const itemArr = [];

    for (let i = 0; i < items.length; ++i) {
      // 相对的坐标
      const relativeItem = decode(items[i]);
      // 真正的坐标
      const actualItem = itemPlus(lastItem, relativeItem);
      if (i === 0) {
        // 每一行第一个要特殊处理，第一个数字不用加上上一个坐标
        actualItem[0] = relativeItem[0];
      }
      lastItem = actualItem;
      itemArr.push(actualItem);
    }
    arr.push(itemArr);
  }
  return arr;
};

// 解析sourcemap的坐标
const parseSourceMap = () => {
  if (cacheSourceMap.sources.length) return;
  const { sources, mappings } = readSouceMap();
  const arr = decodeMappings(mappings);
  cacheSourceMap.sources = sources;
  cacheSourceMap.mappingsCoordinate = arr;
};

// 根据调用栈的代码坐标获取源码的坐标
const findSourceCodeByCoordinate = (x: number, y: number) => {
  const { sources, mappingsCoordinate } = cacheSourceMap;
  const line = mappingsCoordinate[x - 1];
  for (const item of line) {
    if (item[0] === y - 1) {
      const [, sourceIndex, sourceX, sourceY] = item;
      return `${sources[sourceIndex]}:${sourceX + 1}:${sourceY + 1}`;
    }
  }
};

const replaceStackBySource = (target: string) => {
  const [, x, y] = target.split(':');
  const str = findSourceCodeByCoordinate(+x, +y);
  return str || target;
};

// 通过isolate抛出的调用栈解析出源码调用栈
const getSourceStack = async (stack: string) => {
  // 解析sourcemap
  parseSourceMap();

  const newStack = stack.replace(/(\/.+)+:(\d)+:(\d)+/g, replaceStackBySource);
  return newStack;
};

export default getSourceStack;
