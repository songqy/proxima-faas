"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reconcilerState_1 = __importDefault(require("./reconcilerState"));
const events = ['onClick', 'onChange'];
const _processElement = async (ele, getUniqueName, action) => {
    var _a, _b;
    const { type, props } = ele;
    let key = '';
    let obj;
    if (typeof type === 'function') {
        obj = type(props);
        key = getUniqueName(type.name);
    }
    else {
        obj = ele;
        key = getUniqueName(type);
    }
    if ((_b = (_a = obj.props) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.length) {
        const childrens = [];
        for (const item of obj.props.children) {
            if (typeof item === 'object') {
                const result = await _processElement(item, getUniqueName, action);
                childrens.push(result);
            }
            else {
                childrens.push(item);
            }
        }
        obj.props.children = childrens;
    }
    const actions = [];
    for (const event of events) {
        if (obj.props[event]) {
            const dispatch = obj.props[event];
            const name = `${event}.${key}`;
            if (name === (action === null || action === void 0 ? void 0 : action.name)) {
                await dispatch(...(action.payload || []));
            }
            actions.push({
                event,
                name,
            });
        }
    }
    if (actions.length) {
        obj.props.actions = actions;
    }
    obj.props.key = key;
    return obj;
};
const processElement = async (ele, action) => {
    const visitedNames = {};
    const getUniqueName = (name) => {
        if (!visitedNames[name]) {
            visitedNames[name] = 0;
        }
        return `${name}.${visitedNames[name]++}`;
    };
    return await _processElement(ele, getUniqueName, action);
};
const renderApp = (ele) => async ({ state, action, props } = {}) => {
    ele.props = { ...ele.props, ...props };
    reconcilerState_1.default.reset(state ? JSON.parse(state) : null);
    let latestEle = await processElement(ele, action);
    reconcilerState_1.default.effectType = 'effect';
    while (reconcilerState_1.default.effects.length !== 0) {
        reconcilerState_1.default.resetCurrentIndex();
        const effect = reconcilerState_1.default.shiftEffect();
        if (effect) {
            await effect();
            latestEle = await processElement(ele);
        }
    }
    return {
        ele: latestEle,
        state: reconcilerState_1.default.stateData,
    };
};
exports.default = renderApp;
