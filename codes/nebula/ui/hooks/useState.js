"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reconcilerState_1 = __importDefault(require("../reconcilerState"));
const utils_1 = require("../utils");
const updateQueue = [];
// state的批量更新
const batchUpdate = (len) => {
    if (len !== updateQueue.length)
        return;
    const { hooks } = reconcilerState_1.default;
    while (updateQueue.length !== 0) {
        const item = updateQueue.shift();
        if (item) {
            const { index, payload } = item;
            let newVal = payload;
            if (typeof payload === 'function') {
                newVal = payload(hooks[index]);
            }
            hooks[index] = newVal;
        }
    }
    // 触发一次render
    reconcilerState_1.default.enqueueEffect(() => {
        // console.log('setState');
    });
};
const enqueueUpdate = async (index, payload) => {
    updateQueue.push({
        index,
        payload,
    });
    const len = updateQueue.length;
    await Promise.resolve();
    batchUpdate(len);
};
const useState = (initialState) => {
    const { currentIndex, effectType, hooks } = reconcilerState_1.default;
    if (effectType === 'initial') {
        if (typeof initialState === 'function') {
            if ((0, utils_1.isPromise)(initialState)) {
                reconcilerState_1.default.enqueueEffect(async () => {
                    // @ts-ignore 如果state函数，初始化则需要再用一个函数包裹返回
                    const val = await initialState();
                    hooks[currentIndex] = val;
                });
            }
            else {
                // @ts-ignore 如果state函数，初始化则需要再用一个函数包裹返回
                const val = initialState();
                hooks[currentIndex] = val;
            }
        }
        else {
            hooks[currentIndex] = initialState;
        }
    }
    reconcilerState_1.default.currentIndex++;
    return [
        hooks[currentIndex],
        payload => {
            enqueueUpdate(currentIndex, payload);
        },
    ];
};
exports.default = useState;
