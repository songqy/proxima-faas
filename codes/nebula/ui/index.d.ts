import type { ElementType, NebulaElement } from './interface';
export declare const Fragment = "Fragment";
declare const _default: {
    createElement: (type: ElementType, props: Record<string, any>, ...children: NebulaElement[]) => NebulaElement;
    Fragment: string;
};
export default _default;
export { default as useState } from './hooks/useState';
export { default as useEffect } from './hooks/useEffect';
export { default as renderApp } from './renderApp';
export * from './components';
