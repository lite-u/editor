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
const rectangleLike_1 = __importDefault(require("../rectangle/rectangleLike"));
const render_1 = __importDefault(require("./render"));
const deepClone_1 = __importDefault(require("~/core/deepClone"));
const defaultProps_1 = require("~/elements/defaultProps");
const lib_1 = require("~/lib/lib");
class ElementText extends rectangleLike_1.default {
    constructor(_a) {
        var { content = [], font = (0, deepClone_1.default)(defaultProps_1.DEFAULT_TEXT_FONT), verticalAlign = defaultProps_1.DEFAULT_VERTICAL_ALIGN, horizontalAlign = defaultProps_1.DEFAULT_HORIZONTAL_ALIGN } = _a, rest = __rest(_a, ["content", "font", "verticalAlign", "horizontalAlign"]);
        super(Object.assign({}, rest));
        this.type = 'text';
        this.content = content;
        this.font = font;
        this.verticalAlign = verticalAlign;
        this.horizontalAlign = horizontalAlign;
        this.fill = (0, deepClone_1.default)(defaultProps_1.DEFAULT_TEXT_FILL);
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { type: this.type, content: (0, deepClone_1.default)(this.content), font: (0, deepClone_1.default)(this.font), verticalAlign: this.verticalAlign, horizontalAlign: this.horizontalAlign });
    }
    toMinimalJSON() {
        const result = Object.assign(Object.assign({}, super.toMinimalJSON()), { type: this.type, content: (0, deepClone_1.default)(this.content), font: (0, deepClone_1.default)(this.font), verticalAlign: this.verticalAlign, horizontalAlign: this.horizontalAlign });
        if (this.verticalAlign !== defaultProps_1.DEFAULT_VERTICAL_ALIGN) {
            result.verticalAlign = this.verticalAlign;
        }
        if (this.horizontalAlign !== defaultProps_1.DEFAULT_HORIZONTAL_ALIGN) {
            result.horizontalAlign = this.horizontalAlign;
        }
        if (!(0, lib_1.isEqual)(this.font, defaultProps_1.DEFAULT_FONT)) {
            result.horizontalAlign = this.horizontalAlign;
        }
        return result;
    }
    /*  public getOperators(
        resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
        rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
      ) {
  
        return super.getOperators(resizeConfig, rotateConfig, this.getRect(), this.toMinimalJSON(true))
      }*/
    render(ctx) {
        super.render(ctx);
        render_1.default.call(this, ctx);
    }
}
exports.default = ElementText;
