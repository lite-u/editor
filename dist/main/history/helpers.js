"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayToMap = exports.extractIdSetFromArray = void 0;
const extractIdSetFromArray = (from) => {
    return new Set(from.map(item => item.id));
};
exports.extractIdSetFromArray = extractIdSetFromArray;
const arrayToMap = (from) => {
    return new Map(from.map(item => [item.id, item]));
};
exports.arrayToMap = arrayToMap;
