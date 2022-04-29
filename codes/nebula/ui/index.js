"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderApp = exports.useEffect = exports.useState = exports.Fragment = void 0;
const createElement = (type, props, ...children) => {
    return {
        type,
        props: {
            ...props,
            children,
        },
    };
};
exports.Fragment = 'Fragment';
exports.default = { createElement, Fragment: exports.Fragment };
var useState_1 = require("./hooks/useState");
Object.defineProperty(exports, "useState", { enumerable: true, get: function () { return __importDefault(useState_1).default; } });
var useEffect_1 = require("./hooks/useEffect");
Object.defineProperty(exports, "useEffect", { enumerable: true, get: function () { return __importDefault(useEffect_1).default; } });
var renderApp_1 = require("./renderApp");
Object.defineProperty(exports, "renderApp", { enumerable: true, get: function () { return __importDefault(renderApp_1).default; } });
__exportStar(require("./components"), exports);
