class ReconcilerState {
  constructor(props) {
    this.reset();
  }

  reset(data) {
    this._stateHook = data?._stateHook ?? [];
    this._effectType = data?._effectType ?? 'initial';
    this._currentIndex = 0;
    this._effects = [];
  }

  getEffects() {
    return this._effects;
  }

  shiftEffect() {
    return this._effects.shift();
  }

  setEffectType(type) {
    this._effectType = type;
  }

  resetCurrentIndex() {
    this._currentIndex = 0;
  }

  getStateData() {
    const data = {
      _stateHook: this._stateHook,
      _effectType: this._effectType,
    };
    return JSON.stringify(data);
  }

  useState(initialValue) {
    const currentIndex = this._currentIndex;
    if (this._effectType === 'initial') {
      this._stateHook[currentIndex] = initialValue;
    }
    this._currentIndex++;
    return [
      this._stateHook[currentIndex],
      (val) => {
        this._stateHook[currentIndex] = val;
        this._effects.push(() => {
          console.log('setState');
        });
      },
    ];
  }

  useEffect(fun, deps) {
    const currentIndex = this._currentIndex;
    if (this._effectType === 'initial') {
      this._stateHook[currentIndex] = deps;
      this._effects.push(fun);
    } else {
      const prevDeps = this._stateHook[currentIndex];
      for (let i = 0; i < deps.length; ++i) {
        if (deps[i] !== prevDeps[i]) {
          this._effects.push(fun);
          break;
        }
      }
      this._stateHook[currentIndex] = deps;
    }
  }
}

export default new ReconcilerState();
