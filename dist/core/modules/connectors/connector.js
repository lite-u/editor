"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_ts_1 = __importDefault(require("../base.ts"));
class Connector extends base_ts_1.default {
    constructor(_a) {
        var { start, end } = _a, rest = __rest(_a, ["start", "end"]);
        super(rest);
        this.start = start;
        this.end = end;
        // this.width = width!;
        // this.height = height!;
    }
    getDetails() {
        return Object.assign(Object.assign({}, this.getSize()), super.getDetails());
    }
    getSize() {
        return {
            width: 100,
            height: 100,
        };
    }
    getBoundingRect() {
        const { x, y } = { x: 0, y: 1 };
        const { width, height } = this.getSize();
        return {
            x,
            y,
            width,
            height,
            top: y,
            left: x,
            right: x + width,
            bottom: y + height,
        };
    }
}
exports.default = Connector;
