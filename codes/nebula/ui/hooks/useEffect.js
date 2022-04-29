"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reconcilerState_1 = __importDefault(require("../reconcilerState"));
const useEffect = (effect, deps) => {
    const { currentIndex, hooks, effectType } = reconcilerState_1.default;
    if (!deps) {
        reconcilerState_1.default.enqueueEffect(effect);
    }
    else {
        if (effectType === 'initial') {
            reconcilerState_1.default.enqueueEffect(effect);
        }
        else {
            const prevDeps = hooks[currentIndex];
            // 浅比较
            for (let i = 0; i < deps.length; ++i) {
                if (deps[i] !== prevDeps[i]) {
                    reconcilerState_1.default.enqueueEffect(effect);
                    break;
                }
            }
        }
        hooks[currentIndex] = deps;
    }
    reconcilerState_1.default.currentIndex++;
};
exports.default = useEffect;
