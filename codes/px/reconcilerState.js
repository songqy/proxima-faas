class ReconcilerState {
  constructor(props) {
    this.reset();
  }

  reset(data) {
    this._hooks = data?._hooks ?? [];
    this._effectType = data?._effectType ?? 'initial';
    this._currentIndex = 0;
    this._effects = [];
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

  enqueueEffect(effect) {
    this._effects.push(effect);
  }

  resetCurrentIndex() {
    this._currentIndex = 0;
  }

  // useState(initialValue) {
  //   const currentIndex = this._currentIndex;
  //   if (this._effectType === 'initial') {
  //     if (typeof initialValue === 'function') {
  //       this._effects.push(async () => {
  //         const val = await initialValue();
  //         this._hooks[currentIndex] = val;
  //       });
  //     } else {
  //       this._hooks[currentIndex] = initialValue;
  //     }
  //   }
  //   this._currentIndex++;
  //   return [
  //     this._hooks[currentIndex],
  //     (val) => {
  //       let newVal = val;
  //       if (typeof val === 'function') {
  //         newVal = val(this._hooks[currentIndex]);
  //       }
  //       this._hooks[currentIndex] = newVal;
  //       this._effects.push(() => {
  //         console.log('setState');
  //       });
  //     },
  //   ];
  // }

  // useEffect(fun, deps) {
  //   const currentIndex = this._currentIndex;
  //   this._currentIndex++;
  //   if (this._effectType === 'initial') {
  //     this._hooks[currentIndex] = deps;
  //     this._effects.push(fun);
  //   } else {
  //     const prevDeps = this._hooks[currentIndex];
  //     for (let i = 0; i < deps.length; ++i) {
  //       if (deps[i] !== prevDeps[i]) {
  //         this._effects.push(fun);
  //         break;
  //       }
  //     }
  //     this._hooks[currentIndex] = deps;
  //   }
  // }
}

export default new ReconcilerState();
