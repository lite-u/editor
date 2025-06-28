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
const utils_1 = require("~/core/utils");
const geometry_1 = require("~/core/geometry");
const elementBase_1 = __importDefault(require("~/elements/base/elementBase"));
const path_1 = __importDefault(require("~/elements/path/path"));
const generator_1 = __importDefault(require("~/elements/ellipse/generator"));
class ElementEllipse extends elementBase_1.default {
    constructor(_a) {
        var { r1, r2, startAngle = 0, endAngle = 360 } = _a, rest = __rest(_a, ["r1", "r2", "startAngle", "endAngle"]);
        super(rest);
        this.type = 'ellipse';
        this.startAngle = 0;
        this.endAngle = 360;
        this.r1 = r1;
        this.r2 = r2;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.original = Object.assign(Object.assign({}, this.original), { r1: this.r1, r2: this.r1, startAngle: this.startAngle, endAngle: this.endAngle });
        this.updatePath2D();
        this.updateBoundingRect();
        this.updateOriginalBoundingRect();
    }
    static create(id, cx, cy, r1 = 1, r2) {
        return new ElementEllipse({ id, cx, cy, r1, r2: r2 || r1, layer: 0 });
    }
    get getPoints() {
        const { cx, cy, r1, r2, rotation } = this;
        // Points before rotation
        const top = (0, geometry_1.rotatePointAroundPoint)(cx, cy - r2, cx, cy, rotation);
        const bottom = (0, geometry_1.rotatePointAroundPoint)(cx, cy + r2, cx, cy, rotation);
        const left = (0, geometry_1.rotatePointAroundPoint)(cx - r1, cy, cx, cy, rotation);
        const right = (0, geometry_1.rotatePointAroundPoint)(cx + r1, cy, cx, cy, rotation);
        return [top, right, bottom, left];
    }
    updatePath2D() {
        var _a, _b;
        this.path2D = new Path2D();
        const rotationRad = (this.rotation * Math.PI) / 180;
        const startAngle = (((_a = this.startAngle) !== null && _a !== void 0 ? _a : 0) * Math.PI) / 180;
        const endAngle = (((_b = this.endAngle) !== null && _b !== void 0 ? _b : 360) * Math.PI) / 180;
        this.path2D.ellipse(this.cx, this.cy, this.r1, this.r2, rotationRad, startAngle, endAngle);
        if (startAngle !== endAngle) {
            this.path2D.lineTo(this.cx, this.cy);
            this.path2D.closePath();
        }
    }
    updateOriginal() {
        this.original.cx = this.cx;
        this.original.cy = this.cy;
        this.original.r1 = this.r1;
        this.original.r2 = this.r2;
        this.original.rotation = this.rotation;
        this.original.startAngle = this.startAngle;
        this.original.endAngle = this.endAngle;
        this.updateOriginalBoundingRect();
    }
    scaleFrom(scaleX, scaleY, anchor, appliedRotation) {
        if (this._transforming && this._shadowPath) {
            this._shadowPath.scaleFrom(scaleX, scaleY, anchor, appliedRotation);
            this._shadowPath.updateOriginalBoundingRect();
            this.path2D = this._shadowPath.path2D;
            this.boundingRect = this._shadowPath.boundingRect;
            this.originalBoundingRect = this._shadowPath.originalBoundingRect;
            this.originalBoundingRectWithRotation = this._shadowPath.originalBoundingRectWithRotation;
            return {
                id: this.id,
                type: 'expand',
                from: this.toJSON(),
                to: this._shadowPath.toJSON(),
            };
        }
        const { cx, cy, rotation } = this.original;
        const { top, right, bottom, left } = this.originalBoundingRectWithRotation;
        const matrix = new DOMMatrix()
            .translate(anchor.x, anchor.y)
            .rotate(appliedRotation)
            .scale(scaleX, scaleY)
            .rotate(-appliedRotation)
            .translate(-anchor.x, -anchor.y);
        const scaledCorners = [
            { x: left, y: top },
            { x: right, y: top },
            { x: right, y: bottom },
            { x: left, y: bottom },
        ].map(({ x, y }) => {
            const rotatedPoint = (0, geometry_1.rotatePointAroundPoint)(x, y, cx, cy, rotation);
            const d = new DOMPoint(rotatedPoint.x, rotatedPoint.y);
            const scaledPoint = d.matrixTransform(matrix);
            const rotateBack = (0, geometry_1.rotatePointAroundPoint)(scaledPoint.x, scaledPoint.y, cx, cy, -rotation);
            return rotateBack;
        });
        // console.log('scaledCorners', scaledCorners)
        const xs = scaledCorners.map(p => p.x);
        const ys = scaledCorners.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const newWidth = maxX - minX;
        const newHeight = maxY - minY;
        this.r1 = newWidth / 2;
        this.r2 = newHeight / 2;
        const newCenter = new DOMPoint(cx, cy).matrixTransform(matrix);
        this.cx = newCenter.x;
        this.cy = newCenter.y;
        this.updatePath2D();
        this.updateBoundingRect();
        this.updateOriginalBoundingRect();
        return {
            id: this.id,
            from: {
                cx: this.original.cx,
                cy: this.original.cy,
                r1: this.original.r1,
                r2: this.original.r2,
            },
            to: {
                cx: this.cx,
                cy: this.cy,
                r1: this.r1,
                r2: this.r2,
            },
        };
    }
    toMinimalJSON() {
        return Object.assign(Object.assign({}, super.toMinimalJSON()), { startAngle: this.startAngle, endAngle: this.endAngle, type: this.type, r1: this.r1, r2: this.r2 });
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { startAngle: this.startAngle, endAngle: this.endAngle, type: this.type, r1: this.r1, r2: this.r2 });
    }
    toPath() {
        if (this._transforming && this._shadowPath) {
            return this._shadowPath.toPath();
        }
        const points = (0, generator_1.default)(this);
        const rect = (0, geometry_1.getBoundingRectFromBezierPoints)(points);
        return new path_1.default({
            id: this.id,
            type: 'path',
            layer: this.layer,
            closed: true,
            cx: rect.cx,
            cy: rect.cy,
            points,
        });
    }
    getBoundingRect(withoutRotation = false) {
        if (this._transforming && this._shadowPath) {
            return this._shadowPath.getBoundingRect(withoutRotation);
        }
        const { cx, cy, r1, r2, rotation } = this;
        const rect = {
            x: cx - r1,
            y: cy - r2,
            width: r1 * 2,
            height: r2 * 2,
        };
        if (rotation === 0 || withoutRotation) {
            return (0, utils_1.generateBoundingRectFromRect)(rect);
        }
        return (0, utils_1.generateBoundingRectFromRotatedRect)(rect, rotation);
    }
    getBoundingRectFromOriginal(withoutRotation = false) {
        if (this._transforming && this._shadowPath) {
            return this._shadowPath.getBoundingRect(withoutRotation);
        }
        const { cx, cy, r1, r2, rotation } = this.original;
        const width = r1 * 2;
        const height = r2 * 2;
        const x = cx - width / 2;
        const y = cy - height / 2;
        if (rotation === 0 || withoutRotation) {
            return (0, utils_1.generateBoundingRectFromRect)({ x, y, width: width, height: height });
        }
        return (0, utils_1.generateBoundingRectFromRotatedRect)({ x, y, width: width, height: height }, rotation);
    }
}
exports.default = ElementEllipse;
