import type { EffectCallback } from './interface';

class ReconcilerState {
  _hooks: any[];
  _effectType: string;
  _currentIndex: number;
  _effects: EffectCallback[];
  constructor() {
    this._hooks = [];
    this._effectType = 'initial';
    this._currentIndex = 0;
    this._effects = [];
  }

  reset(data?: Record<string, any>) {
    this._hooks = data?._hooks ?? [];
    this._effectType = data?._effectType ?? 'initial';
  }

  get effects() {
    return this._effects;
  }

  get stateData() {
    const data = {
      _hooks: this._hooks,
      _effectType: this._effectType,
    };
    return JSON.stringify(data);
  }

  get currentIndex() {
    return this._currentIndex;
  }

  set currentIndex(index) {
    this._currentIndex = index;
  }

  get hooks() {
    return this._hooks;
  }

  get effectType() {
    return this._effectType;
  }

  set effectType(type) {
    this._effectType = type;
  }

  shiftEffect() {
    return this._effects.shift();
  }

  enqueueEffect(effect: EffectCallback) {
    this._effects.push(effect);
  }

  resetCurrentIndex() {
    this._currentIndex = 0;
  }
}

export default new ReconcilerState();
