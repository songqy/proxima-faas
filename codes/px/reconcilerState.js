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
}

export default new ReconcilerState();
