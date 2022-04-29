export declare type ElementType = string | ((props: Record<string, any>) => NebulaElement);
export interface NebulaElement {
    type: ElementType;
    props: Record<string, any>;
}
export declare type EffectCallback = (() => void) | (() => Promise<void>);
export declare type Dependency = boolean | string | number | object;
export declare type DependencyList = ReadonlyArray<Dependency>;
export interface Action {
    name: string;
    payload?: any[];
}
export interface StateData {
    _hooks: any[];
    _effectType: string;
}
