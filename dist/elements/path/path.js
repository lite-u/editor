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
const deepClone_1 = __importDefault(require("~/core/deepClone"));
const geometry_1 = require("~/core/geometry");
const index_1 = require("~/index");
class ElementPath extends elementBase_1.default {
    constructor(_a) {
        var { points = [], closed = false } = _a, rest = __rest(_a, ["points", "closed"]);
        super(rest);
        this.type = 'path';
        this.points = [];
        // this.points = deepClone(points)
        this.closed = closed;
        const _points = (0, deepClone_1.default)(points);
        _points.map((point, index) => {
            if (!point.id) {
                point.id = (0, index_1.nid)();
            }
        });
        this.points = (0, deepClone_1.default)(_points);
        // debugger
        this.original = Object.assign(Object.assign({}, this.original), { closed, points: _points, rotation: this.rotation });
        this.updatePath2D();
        this.updateBoundingRect();
        this.updateOriginalBoundingRect();
        // console.trace(this)
    }
    updateOriginal() {
        this.original.cx = this.cx;
        this.original.cy = this.cy;
        this.original.points = (0, deepClone_1.default)(this.points);
        this.original.closed = this.closed;
        this.original.rotation = this.rotation;
        // this.updatePath2D()
        this.updateOriginalBoundingRect();
    }
    static _rotateBezierPointsFrom(cx, cy, rotation, points) {
        const matrix = new DOMMatrix()
            .translate(cx, cy)
            .rotate(rotation)
            .translate(-cx, -cy);
        const transformedPoints = points.map(p => ({
            id: p.id,
            anchor: rotation
                ? elementBase_1.default.transformPoint(p.anchor.x, p.anchor.y, matrix)
                : { x: p.anchor.x, y: p.anchor.y },
            cp1: p.cp1
                ? (rotation
                    ? ElementPath.transformPoint(p.cp1.x, p.cp1.y, matrix)
                    : { x: p.cp1.x, y: p.cp1.y })
                : undefined,
            cp2: p.cp2
                ? (rotation
                    ? ElementPath.transformPoint(p.cp2.x, p.cp2.y, matrix)
                    : { x: p.cp2.x, y: p.cp2.y })
                : undefined,
        }));
        return transformedPoints;
    }
    getBezierPoints() {
        return this.points.map(({ id, anchor, cp1, cp2, type }) => {
            return {
                id,
                type,
                anchor: { x: anchor.x, y: anchor.y },
                cp1: cp1 ? { x: cp1.x, y: cp1.y } : null,
                cp2: cp2 ? { x: cp2.x, y: cp2.y } : null,
            };
        });
    }
    /*  public getBezierPoints(): BezierPoint[] {
        const {cx, cy} = this
        const transform = new DOMMatrix()
          .translate(cx, cy)
          // .rotate(this.rotation)
          .translate(-cx, -cy)
  
        return this.points.map(({anchor, cp1, cp2, type}) => {
          const t_cp1 = cp1 ? ElementBase.transformPoint(cp1.x, cp1.y, transform) : null
          const t_cp2 = cp2 ? ElementBase.transformPoint(cp2.x, cp2.y, transform) : null
          const t_anchor = ElementBase.transformPoint(anchor.x, anchor.y, transform)
  
          return {
            type,
            anchor: t_anchor,
            cp1: t_cp1,
            cp2: t_cp2,
          }
        })
      }*/
    updatePath2D() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.points.length === 0)
            return;
        const start = this.points[0].anchor;
        this.path2D = new Path2D();
        this.path2D.moveTo(start.x, start.y);
        for (let i = 1; i < this.points.length; i++) {
            const prev = this.points[i - 1];
            const curr = this.points[i];
            const prevType = (_a = prev.type) !== null && _a !== void 0 ? _a : 'directional';
            const currType = (_b = curr.type) !== null && _b !== void 0 ? _b : 'directional';
            const cp1 = prevType === 'corner' ? prev.anchor : ((_c = prev.cp2) !== null && _c !== void 0 ? _c : prev.anchor);
            const cp2 = currType === 'corner' ? curr.anchor : ((_d = curr.cp1) !== null && _d !== void 0 ? _d : curr.anchor);
            const anchor = curr.anchor;
            this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, anchor.x, anchor.y);
        }
        if (this.closed && this.points.length > 1) {
            const last = this.points[this.points.length - 1];
            const first = this.points[0];
            const lastType = (_e = last.type) !== null && _e !== void 0 ? _e : 'directional';
            const firstType = (_f = first.type) !== null && _f !== void 0 ? _f : 'directional';
            const cp1 = lastType === 'corner' ? last.anchor : ((_g = last.cp2) !== null && _g !== void 0 ? _g : last.anchor);
            const cp2 = firstType === 'corner' ? first.anchor : ((_h = first.cp1) !== null && _h !== void 0 ? _h : first.anchor);
            const anchor = first.anchor;
            this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, anchor.x, anchor.y);
            this.path2D.closePath();
        }
    }
    translate(dx, dy, f) {
        var _a;
        this.cx = this.cx + dx;
        this.cy = this.cy + dy;
        this.points.forEach((point) => {
            point.anchor.x += dx;
            point.anchor.y += dy;
            if (point.cp1) {
                point.cp1.x += dx;
                point.cp1.y += dy;
            }
            if (point.cp2) {
                point.cp2.x += dx;
                point.cp2.y += dy;
            }
        });
        this.updatePath2D();
        this.updateBoundingRect();
        // this.transform.cx = this.cx
        // this.transform.cy = this.cy
        (_a = this.eventListeners['move']) === null || _a === void 0 ? void 0 : _a.forEach(handler => handler({ dx, dy }));
        if (f) {
            return {
                id: this.id,
                from: {
                    cx: this.original.cx,
                    cy: this.original.cy,
                    points: (0, deepClone_1.default)(this.original.points),
                },
                to: {
                    cx: this.cx,
                    cy: this.cy,
                    points: (0, deepClone_1.default)(this.points),
                },
            };
        }
    }
    /*  public translatePoint() {
  
      }*/
    rotateFrom(rotation, anchor, f) {
        const { cx, cy, points } = this.original;
        const newPoints = ElementPath._rotateBezierPointsFrom(anchor.x, anchor.y, rotation, points);
        const { x, y } = (0, geometry_1.rotatePointAroundPoint)(cx, cy, anchor.x, anchor.y, rotation);
        let newRotation = (this.original.rotation + rotation) % 360;
        if (newRotation < 0)
            newRotation += 360;
        this.cx = x;
        this.cy = y;
        this.rotation = newRotation;
        this.points = newPoints;
        this.updatePath2D();
        this.updateBoundingRect();
        if (f) {
            return {
                id: this.id,
                from: {
                    cx: this.original.cx,
                    cy: this.original.cy,
                    rotation: this.original.rotation,
                    points: (0, deepClone_1.default)(this.original.points),
                },
                to: {
                    cx: this.cx,
                    cy: this.cy,
                    rotation: this.rotation,
                    points: (0, deepClone_1.default)(this.points),
                },
            };
        }
    }
    scaleFrom(scaleX, scaleY, anchor, appliedRotation) {
        // console.log(appliedRotation, center)
        // Use rotation-aware scaling: rotate to 0, scale, rotate back
        const { rotation, cx, cy, points } = this.original;
        /*if (appliedRotation !== rotation) {
          anchor = rotatePointAroundPoint(anchor.x, anchor.y, center.x, center.y, rotation)
        }*/
        // The transform: anchor -> rotate -> scale -> unrotate -> unanchor
        const matrix = new DOMMatrix()
            .translate(anchor.x, anchor.y)
            .rotate(appliedRotation)
            .scale(scaleX, scaleY)
            .rotate(-appliedRotation)
            .translate(-anchor.x, -anchor.y);
        this.points = points.map(({ id, anchor: ptAnchor, cp1, cp2, type, symmetric }) => {
            const newAnchor = new DOMPoint(ptAnchor.x, ptAnchor.y).matrixTransform(matrix);
            const newCP1 = cp1 ? new DOMPoint(cp1.x, cp1.y).matrixTransform(matrix) : undefined;
            const newCP2 = cp2 ? new DOMPoint(cp2.x, cp2.y).matrixTransform(matrix) : undefined;
            return {
                id,
                type,
                symmetric,
                anchor: { x: newAnchor.x, y: newAnchor.y },
                cp1: newCP1 ? { x: newCP1.x, y: newCP1.y } : undefined,
                cp2: newCP2 ? { x: newCP2.x, y: newCP2.y } : undefined,
            };
        });
        const newCenter = new DOMPoint(cx, cy).matrixTransform(matrix);
        this.cx = newCenter.x;
        this.cy = newCenter.y;
        this.updatePath2D();
        this.updateBoundingRect();
        return {
            id: this.id,
            from: {
                cx,
                cy,
                points: (0, deepClone_1.default)(points),
            },
            to: {
                cx: this.cx,
                cy: this.cy,
                points: (0, deepClone_1.default)(this.points),
            },
        };
    }
    getBoundingRect(withoutRotation = false) {
        const { cx, cy, rotation, points } = this;
        const r = withoutRotation ? -rotation : 0;
        const transformedPoints = ElementPath._rotateBezierPointsFrom(cx, cy, r, points);
        return (0, geometry_1.getBoundingRectFromBezierPoints)(transformedPoints);
    }
    getBoundingRectFromOriginal(withoutRotation = false) {
        const { cx, cy, rotation, points } = this.original;
        const r = withoutRotation ? -rotation : 0;
        const transformedPoints = ElementPath._rotateBezierPointsFrom(cx, cy, r, points);
        return (0, geometry_1.getBoundingRectFromBezierPoints)(transformedPoints);
    }
    toPath() {
        return this.clone();
    }
    toJSON() {
        return Object.assign({ type: this.type, points: this.points, closed: this.closed }, super.toJSON());
    }
    toMinimalJSON() {
        return Object.assign({ type: this.type, points: this.points, closed: this.closed }, super.toMinimalJSON());
    }
}
exports.default = ElementPath;
