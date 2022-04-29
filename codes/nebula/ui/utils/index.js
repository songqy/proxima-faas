"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromise = void 0;
// eslint-disable-next-line @typescript-eslint/ban-types
const isPromise = (fun) => {
    return fun.constructor.name === 'AsyncFunction';
};
exports.isPromise = isPromise;
