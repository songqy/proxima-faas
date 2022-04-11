const createElement = (type, props, ...children) => {
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
