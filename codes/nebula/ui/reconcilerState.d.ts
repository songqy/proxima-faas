import type { EffectCallback, StateData } from './interface';
declare class ReconcilerState {
    _hooks: any[];
    _effectType: string;
    _currentIndex: number;
    _effects: EffectCallback[];
    constructor();
    reset(data?: StateData): void;
    get effects(): EffectCallback[];
    get stateData(): string;
    get currentIndex(): number;
    set currentIndex(index: number);
    get hooks(): any[];
    get effectType(): string;
    set effectType(type: string);
    shiftEffect(): EffectCallback | undefined;
    enqueueEffect(effect: EffectCallback): void;
    resetCurrentIndex(): void;
}
declare const _default: ReconcilerState;
export default _default;
