"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReconcilerState {
    constructor() {
        this._hooks = [];
        this._effectType = 'initial';
        this._currentIndex = 0;
        this._effects = [];
    }
    reset(data) {
        var _a, _b;
        this._hooks = (_a = data === null || data === void 0 ? void 0 : data._hooks) !== null && _a !== void 0 ? _a : this._hooks;
        this._effectType = (_b = data === null || data === void 0 ? void 0 : data._effectType) !== null && _b !== void 0 ? _b : this._effectType;
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
exports.default = new ReconcilerState();
