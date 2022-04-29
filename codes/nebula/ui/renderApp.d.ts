import type { NebulaElement, Action } from './interface';
interface RenderData {
    state?: string;
    action?: Action;
    props?: Record<string, any>;
}
declare const renderApp: (ele: NebulaElement) => ({ state, action, props }?: RenderData) => Promise<{
    ele: NebulaElement;
    state: string;
}>;
export default renderApp;
