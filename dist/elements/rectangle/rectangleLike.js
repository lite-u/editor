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
const defaultProps_1 = require("~/elements/defaultProps");
const lib_1 = require("~/lib/lib");
const elementBase_1 = __importDefault(require("~/elements/base/elementBase"));
const geometry_1 = require("~/core/geometry");
const path_1 = __importDefault(require("~/elements/path/path"));
const index_1 = require("~/index");
class RectangleLike extends elementBase_1.default {
    // path2D: Path2D = new Path2D()
    // private original: { cx: number, cy: number, width: number, height: number, rotation: number }
    constructor(_a) {
        var { 
        // id,
        // layer,
        width = defaultProps_1.DEFAULT_WIDTH, height = defaultProps_1.DEFAULT_HEIGHT, borderRadius = defaultProps_1.DEFAULT_BORDER_RADIUS } = _a, rest = __rest(_a, ["width", "height", "borderRadius"]);
        super(rest);
        // this.id = id
        // this.layer = layer
        this.width = width;
        this.height = height;
        this.borderRadius = borderRadius;
        this.original = Object.assign(Object.assign({}, this.original), { width,
            height });
        this.updatePath2D();
        this.updateBoundingRect();
        this.updateOriginalBoundingRect();
    }
    /*
  
      static corners(prop: CenterBasedRect): Point[] {
        const w = prop.width / 2
        const h = prop.height / 2
  
        return [
          {x: prop.cx - w, y: prop.cy - h}, // top-left
          {x: prop.cx + w, y: prop.cy - h}, // top-right
          {x: prop.cx + w, y: prop.cy + h}, // bottom-right
          {x: prop.cx - w, y: prop.cy + h},  // bottom-left
        ]
      }
    */
    updatePath2D() {
        const { cx, cy, borderRadius, rotation } = this;
        const [tl, tr, br, bl] = borderRadius;
        const { top, right, bottom, left } = this.getBoundingRect(true);
        const matrix = new DOMMatrix()
            .translate(cx, cy)
            .rotate(rotation)
            .translate(-cx, -cy);
        const topLeft = matrix.transformPoint({ x: left, y: top });
        const topRight = matrix.transformPoint({ x: right, y: top });
        const bottomRight = matrix.transformPoint({ x: right, y: bottom });
        const bottomLeft = matrix.transformPoint({ x: left, y: bottom });
        this.path2D = new Path2D();
        this.path2D.moveTo(topLeft.x + tl, topLeft.y);
        if (tr > 0) {
            this.path2D.arcTo(topRight.x, topRight.y, bottomRight.x, bottomRight.y, tr);
        }
        else {
            this.path2D.lineTo(topRight.x, topRight.y);
        }
        if (br > 0) {
            this.path2D.arcTo(bottomRight.x, bottomRight.y, bottomLeft.x, bottomLeft.y, br);
        }
        else {
            this.path2D.lineTo(bottomRight.x, bottomRight.y);
        }
        if (bl > 0) {
            this.path2D.arcTo(bottomLeft.x, bottomLeft.y, topLeft.x, topLeft.y, bl);
        }
        else {
            this.path2D.lineTo(bottomLeft.x, bottomLeft.y);
        }
        if (tl > 0) {
            this.path2D.arcTo(topLeft.x, topLeft.y, topRight.x, topRight.y, tl);
        }
        else {
            this.path2D.lineTo(topLeft.x, topLeft.y);
        }
        this.path2D.closePath();
    }
    updateOriginal() {
        this.original.cx = this.cx;
        this.original.cy = this.cy;
        this.original.width = this.width;
        this.original.height = this.height;
        this.original.rotation = this.rotation;
        this.updateOriginalBoundingRect();
        // this.updatePath2D()
        // this.updateBoundingRect()
    }
    get getPoints() {
        const w = this.width / 2;
        const h = this.height / 2;
        return [
            { x: this.cx - w, y: this.cy - h }, // top-left
            { x: this.cx + w, y: this.cy - h }, // top-right
            { x: this.cx + w, y: this.cy + h }, // bottom-right
            { x: this.cx - w, y: this.cy + h }, // bottom-left
        ];
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
        this.width = newWidth;
        this.height = newHeight;
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
                width: this.original.width,
                height: this.original.height,
            },
            to: {
                cx: this.cx,
                cy: this.cy,
                width: this.width,
                height: this.height,
            },
        };
    }
    /*scaleOnPath(scaleX: number, scaleY: number, anchor: Point, appliedRotation: number) {
      if (!this._shadowPath) {
        this._shadowPath = this.toPath()
        // this.originalBoundingRect = this._shadowPath.originalBoundingRect
        // this.originalBoundingRectWithRotation = this._shadowPath.originalBoundingRectWithRotation
      }
  
      this._shadowPath.scaleFrom(scaleX, scaleY, anchor, appliedRotation)
      this._shadowPath.updateOriginalBoundingRect()
  
      this.path2D = this._shadowPath.path2D
      this.boundingRect = this._shadowPath.boundingRect
      this.originalBoundingRect = this._shadowPath.originalBoundingRect
      this.originalBoundingRectWithRotation = this._shadowPath.originalBoundingRectWithRotation
    }*/
    toJSON() {
        const { borderRadius, width, height, } = this;
        if (!borderRadius) {
            debugger;
        }
        return Object.assign(Object.assign({}, super.toJSON()), { borderRadius: [...borderRadius], width,
            height });
    }
    toMinimalJSON() {
        const result = Object.assign({}, super.toMinimalJSON());
        if (!(0, lib_1.isEqual)(this.borderRadius, defaultProps_1.DEFAULT_BORDER_RADIUS)) {
            result.borderRadius = [...this.borderRadius];
        }
        if (this.width !== defaultProps_1.DEFAULT_WIDTH) {
            result.width = this.width;
        }
        if (this.height !== defaultProps_1.DEFAULT_HEIGHT) {
            result.height = this.height;
        }
        return result;
    }
    toPath() {
        if (this._transforming && this._shadowPath) {
            return this._shadowPath.toPath();
        }
        const _a = this.toJSON(), { id, layer, borderRadius } = _a, rest = __rest(_a, ["id", "layer", "borderRadius"]);
        const { cx, cy, width, height, rotation } = this.original;
        const [tl, tr, br, bl] = borderRadius;
        const halfW = width / 2;
        const halfH = height / 2;
        const corners = [
            { x: cx - halfW + tl, y: cy - halfH }, // top-left start
            { x: cx + halfW - tr, y: cy - halfH }, // top-right start
            { x: cx + halfW, y: cy - halfH + tr }, // top-right arc
            { x: cx + halfW, y: cy + halfH - br }, // bottom-right start
            { x: cx + halfW - br, y: cy + halfH }, // bottom-right arc
            { x: cx - halfW + bl, y: cy + halfH }, // bottom-left start
            { x: cx - halfW, y: cy + halfH - bl }, // bottom-left arc
            { x: cx - halfW, y: cy - halfH + tl }, // top-left arc
        ];
        const rotatedPoints = corners.map(p => (0, geometry_1.rotatePointAroundPoint)(p.x, p.y, cx, cy, rotation));
        const points = rotatedPoints.map(p => ({
            id: (0, index_1.nid)(),
            anchor: p,
            cp1: null,
            cp2: null,
            type: 'corner',
        }));
        return new path_1.default(Object.assign({ id,
            layer, type: 'path', points,
            closed }, rest));
    }
    getBoundingRect(withoutRotation = false) {
        if (this._transforming && this._shadowPath) {
            return this._shadowPath.getBoundingRect(withoutRotation);
        }
        const { cx, cy, width, height, rotation } = this;
        const x = cx - width / 2;
        const y = cy - height / 2;
        if (rotation === 0 || withoutRotation) {
            return (0, utils_1.generateBoundingRectFromRect)({ x, y, width, height });
        }
        return (0, utils_1.generateBoundingRectFromRotatedRect)({ x, y, width, height }, rotation);
    }
    getBoundingRectFromOriginal(withoutRotation = false) {
        if (this._transforming && this._shadowPath) {
            return this._shadowPath.getBoundingRect(withoutRotation);
        }
        const { cx, cy, width, height, rotation } = this.original;
        const x = cx - width / 2;
        const y = cy - height / 2;
        if (rotation === 0 || withoutRotation) {
            return (0, utils_1.generateBoundingRectFromRect)({ x, y, width: width, height: height });
        }
        return (0, utils_1.generateBoundingRectFromRotatedRect)({ x, y, width: width, height: height }, rotation);
    }
}
exports.default = RectangleLike;
