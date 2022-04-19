import type { ElementType, ElementData } from './interface';

const createElement = (
  type: ElementType,
  props: Record<string, any>,
  ...children: any[]
): ElementData => {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
};

export const Fragment = 'Fragment';

export default { createElement, Fragment };
export { default as useState } from './useState';
export { default as useEffect } from './useEffect';
export { default as renderApp } from './renderApp';
export * from './components';
