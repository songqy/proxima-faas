export type ElementType = string | Function;
export interface ElementData {
  type: ElementType;
  props: Record<string, any>;
}
export type EffectFun = (() => void) | (() => Promise<void>);
