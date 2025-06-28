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
const handleBasics_ts_1 = require("../handleBasics.ts");
const lib_ts_1 = require("../../../lib/lib.ts");
const rectangle_ts_1 = __importDefault(require("./rectangle.ts"));
class Shape extends base_ts_1.default {
    constructor(_a) {
        var { x, y, fillColor, enableFill = true } = _a, rest = __rest(_a, ["x", "y", "fillColor", "enableFill"]);
        super(rest);
        this.x = x;
        this.y = y;
        this.fillColor = fillColor;
        this.enableFill = enableFill;
    }
    getDetails(includeIdentifiers = true) {
        return Object.assign(Object.assign({}, super.getDetails(includeIdentifiers)), { fillColor: this.fillColor, enableFill: this.enableFill, x: this.x, y: this.y });
    }
    move(x, y) {
        this.x += x;
        this.y += y;
    }
    getOperators(resizeConfig, rotateConfig, boundingRect, moduleOrigin) {
        const { x: cx, y: cy, width, height } = boundingRect;
        // const id = this.id
        const { id, rotation } = this;
        const handlers = handleBasics_ts_1.HANDLER_OFFSETS.map((OFFSET) => {
            // Calculate the handle position in local coordinates
            const currentCenterX = cx - width / 2 + OFFSET.x * width;
            const currentCenterY = cy - height / 2 + OFFSET.y * height;
            const currentModuleProps = {
                id,
                width: 0,
                height: 0,
                x: currentCenterX,
                y: currentCenterY,
                lineColor: '',
                lineWidth: 0,
                rotation,
                layer: this.layer,
                opacity: 100,
            };
            // let cursor: ResizeCursor = OFFSET.cursor as ResizeCursor
            if (OFFSET.type === 'resize') {
                const rotated = (0, lib_ts_1.rotatePoint)(currentCenterX, currentCenterY, cx, cy, rotation);
                // cursor = getCursor(rotated.x, rotated.y, cx, cy, rotation)
                currentModuleProps.id += 'resize';
                currentModuleProps.x = rotated.x;
                currentModuleProps.y = rotated.y;
                currentModuleProps.width = resizeConfig.size;
                currentModuleProps.height = resizeConfig.size;
                currentModuleProps.lineWidth = resizeConfig.lineWidth;
                currentModuleProps.lineColor = resizeConfig.lineColor;
                currentModuleProps.fillColor = resizeConfig.fillColor;
            }
            else if (OFFSET.type === 'rotate') {
                const currentRotateHandlerCenterX = currentCenterX + OFFSET.offsetX * resizeConfig.lineWidth;
                const currentRotateHandlerCenterY = currentCenterY + OFFSET.offsetY * resizeConfig.lineWidth;
                const rotated = (0, lib_ts_1.rotatePoint)(currentRotateHandlerCenterX, currentRotateHandlerCenterY, cx, cy, rotation);
                currentModuleProps.id += 'rotate';
                currentModuleProps.x = rotated.x;
                currentModuleProps.y = rotated.y;
                currentModuleProps.width = rotateConfig.size;
                currentModuleProps.height = rotateConfig.size;
                currentModuleProps.lineWidth = rotateConfig.lineWidth;
                currentModuleProps.lineColor = rotateConfig.lineColor;
                currentModuleProps.fillColor = rotateConfig.fillColor;
            }
            return {
                id: `${id}`,
                type: OFFSET.type,
                name: OFFSET.name,
                // cursor,
                moduleOrigin,
                module: new rectangle_ts_1.default(currentModuleProps),
            };
        });
        return handlers;
    }
    isInsideRect(outer) {
        const inner = this.getBoundingRect();
        return (inner.left >= outer.left &&
            inner.right <= outer.right &&
            inner.top >= outer.top &&
            inner.bottom <= outer.bottom);
    }
}
exports.default = Shape;
