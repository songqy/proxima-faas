export type ElementType = string | Function;
export interface ElementData {
  type: ElementType;
  props: Record<string, any>;
}
export type EffectCallback = (() => void) | (() => Promise<void>);
export type Dependency = boolean | string | number | object;
export type DependencyList = ReadonlyArray<Dependency>;
export interface Action {
  name: string;
  payload?: any[];
}

export interface StateData {
  _hooks: any[];
  _effectType: string;
}
