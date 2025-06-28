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
const elementBase_1 = __importDefault(require("~/elements/base/elementBase"));
const utils_1 = require("~/core/utils");
const deepClone_1 = __importDefault(require("~/core/deepClone"));
class ElementLineSegment extends elementBase_1.default {
    constructor(_a) {
        var { start, end } = _a, rest = __rest(_a, ["start", "end"]);
        super(rest);
        this.type = 'lineSegment';
        this.start = Object.assign({}, start);
        this.end = Object.assign({}, end);
        this.original = Object.assign(Object.assign({}, this.original), { start: Object.assign({}, start), end: Object.assign({}, end), rotation: this.rotation });
        this.updatePath2D();
        this.updateBoundingRect();
    }
    static create(id, sX, sY, eX, eY) {
        const centerX = (sX + eX) / 2;
        const centerY = (sY + eY) / 2;
        return new ElementLineSegment({
            id,
            layer: 0,
            cx: centerX,
            cy: centerY,
            start: { x: sX, y: sY },
            end: { x: eX, y: eY },
        });
    }
    static _getBoundingRect(start, end, rotation = 0) {
        const x = Math.min(start.x, end.x);
        const y = Math.min(start.y, end.y);
        let width = Math.abs(end.x - start.x);
        let height = Math.abs(end.y - start.y);
        if (width <= 0) {
            width = 1;
        }
        if (height <= 0) {
            height = 1;
        }
        if (rotation === 0) {
            return (0, utils_1.generateBoundingRectFromRect)({ x, y, width, height });
        }
        return (0, utils_1.generateBoundingRectFromRotatedRect)({ x, y, width, height }, rotation);
    }
    updatePath2D() {
        const { cx, cy, start, end, rotation } = this;
        const matrix = new DOMMatrix()
            .translate(cx, cy)
            .rotate(rotation)
            .translate(-cx, -cy);
        const rotatedStart = elementBase_1.default.transformPoint(start.x, start.y, matrix);
        const rotatedEnd = elementBase_1.default.transformPoint(end.x, end.y, matrix);
        this.path2D = new Path2D();
        this.path2D.moveTo(rotatedStart.x, rotatedStart.y);
        this.path2D.lineTo(rotatedEnd.x, rotatedEnd.y);
    }
    updateOriginal() {
        this.original.cx = this.cx;
        this.original.cy = this.cy;
        this.original.start = Object.assign({}, this.start);
        this.original.end = Object.assign({}, this.end);
        this.original.rotation = this.rotation;
        // this.updatePath2D()
        this.updateOriginalBoundingRect();
    }
    getBoundingRect(withoutRotation = false) {
        const { start, end, rotation } = this;
        const r = withoutRotation ? -rotation : 0;
        return ElementLineSegment._getBoundingRect(start, end, r);
    }
    getBoundingRectFromOriginal(withoutRotation = false) {
        const { start, end, rotation } = this.original;
        const r = withoutRotation ? -rotation : 0;
        return ElementLineSegment._getBoundingRect(start, end, r);
    }
    translate(dx, dy, f = false) {
        var _a;
        this.cx = this.cx + dx;
        this.cy = this.cy + dy;
        this.start.x += dx;
        this.start.y += dy;
        this.end.x += dx;
        this.end.y += dy;
        this.updatePath2D();
        (_a = this.eventListeners['move']) === null || _a === void 0 ? void 0 : _a.forEach(handler => handler({ dx, dy }));
        if (f) {
            return {
                id: this.id,
                from: {
                    cx: this.original.cx,
                    cy: this.original.cy,
                    start: (0, deepClone_1.default)(this.original.start),
                    end: (0, deepClone_1.default)(this.original.end),
                },
                to: {
                    cx: this.cx,
                    cy: this.cy,
                    start: (0, deepClone_1.default)(this.start),
                    end: (0, deepClone_1.default)(this.end),
                },
            };
        }
    }
    scaleFrom(scaleX, scaleY, anchor /*,center:Point*/) {
        const matrix = new DOMMatrix()
            .translate(anchor.x, anchor.y)
            .scale(scaleX, scaleY)
            .translate(-anchor.x, -anchor.y);
        const { start, end } = this.original;
        // Adjust to absolute coordinates for transformation
        const newStart = elementBase_1.default.transformPoint(start.x, start.y, matrix);
        const newEnd = elementBase_1.default.transformPoint(end.x, end.y, matrix);
        this.start.x = newStart.x;
        this.start.y = newStart.y;
        this.end.x = newEnd.x;
        this.end.y = newEnd.y;
        this.cx = (newStart.x + newEnd.x) / 2;
        this.cy = (newStart.y + newEnd.y) / 2;
        this.updatePath2D();
        this.updateBoundingRect();
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { type: this.type, start: Object.assign({}, this.start), end: Object.assign({}, this.end) });
    }
    toMinimalJSON() {
        return Object.assign(Object.assign({}, super.toMinimalJSON()), { type: this.type, start: Object.assign({}, this.start), end: Object.assign({}, this.end) });
    }
}
exports.default = ElementLineSegment;
