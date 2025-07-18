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
const render_1 = __importDefault(require("./render"));
const rectangleLike_1 = __importDefault(require("~/elements/rectangle/rectangleLike"));
const deepClone_1 = __importDefault(require("~/core/deepClone"));
class ElementImage extends rectangleLike_1.default {
    constructor(_a) {
        var { asset } = _a, rest = __rest(_a, ["asset"]);
        super(rest);
        this.type = 'image';
        this.asset = asset;
        // this.updateTransform()
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { asset: (0, deepClone_1.default)(this.asset), type: this.type });
    }
    toMinimalJSON() {
        return Object.assign(Object.assign({}, super.toMinimalJSON()), { asset: (0, deepClone_1.default)(this.asset), type: this.type });
    }
    render(ctx) {
        render_1.default.call(this, ctx);
    }
}
exports.default = ElementImage;
