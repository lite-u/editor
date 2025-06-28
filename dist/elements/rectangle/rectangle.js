"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rectangleLike_1 = __importDefault(require("~/elements/rectangle/rectangleLike"));
class ElementRectangle extends rectangleLike_1.default {
    constructor(props) {
        super(props);
        this.type = 'rectangle';
        this.updatePath2D();
        this.updateBoundingRect();
    }
    static create(id, cx, cy, width = 10, height) {
        const _height = height || width;
        const props = {
            id,
            width,
            cx,
            cy,
            height: _height,
            layer: 0,
        };
        return new ElementRectangle(props);
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { type: this.type });
    }
    toMinimalJSON() {
        return Object.assign(Object.assign({}, super.toMinimalJSON()), { type: this.type });
    }
}
exports.default = ElementRectangle;
