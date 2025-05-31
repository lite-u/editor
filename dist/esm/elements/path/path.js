import ElementBase from '../base/elementBase.js';
import deepClone from '../../core/deepClone.js';
import { getBoundingRectFromBezierPoints, rotatePointAroundPoint } from '../../core/geometry.js';
class ElementPath extends ElementBase {
    type = 'path';
    points = [];
    closed;
    constructor({ points = [], closed = false, ...rest }) {
        super(rest);
        this.points = deepClone(points);
        this.closed = closed;
        // debugger
        this.original = {
            ...this.original,
            closed,
            points: deepClone(points),
            rotation: this.rotation,
        };
        this.updatePath2D();
        this.updateBoundingRect();
    }
    updateOriginal() {
        this.original.cx = this.cx;
        this.original.cy = this.cy;
        this.original.points = deepClone(this.points);
        this.original.closed = this.closed;
        this.original.rotation = this.rotation;
        this.updatePath2D();
        this.updateBoundingRect();
    }
    static _rotateBezierPointsFrom(cx, cy, rotation, points) {
        const matrix = new DOMMatrix()
            .translate(cx, cy)
            .rotate(rotation)
            .translate(-cx, -cy);
        const transformedPoints = points.map(p => ({
            anchor: rotation
                ? ElementBase.transformPoint(p.anchor.x, p.anchor.y, matrix)
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
        const { cx, cy } = this;
        const transform = new DOMMatrix()
            .translate(cx, cy)
            // .rotate(this.rotation)
            .translate(-cx, -cy);
        return this.points.map(({ anchor, cp1, cp2, type }) => {
            const t_cp1 = cp1 ? ElementBase.transformPoint(cp1.x, cp1.y, transform) : null;
            const t_cp2 = cp2 ? ElementBase.transformPoint(cp2.x, cp2.y, transform) : null;
            const t_anchor = ElementBase.transformPoint(anchor.x, anchor.y, transform);
            return {
                type,
                anchor: t_anchor,
                cp1: t_cp1,
                cp2: t_cp2,
            };
        });
    }
    updatePath2D() {
        if (this.points.length === 0)
            return;
        const start = this.points[0].anchor;
        this.path2D = new Path2D();
        this.path2D.moveTo(start.x, start.y);
        for (let i = 1; i < this.points.length; i++) {
            const prev = this.points[i - 1];
            const curr = this.points[i];
            const prevType = prev.type ?? 'directional';
            const currType = curr.type ?? 'directional';
            const cp1 = prevType === 'corner' ? prev.anchor : (prev.cp2 ?? prev.anchor);
            const cp2 = currType === 'corner' ? curr.anchor : (curr.cp1 ?? curr.anchor);
            const anchor = curr.anchor;
            this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, anchor.x, anchor.y);
        }
        if (this.closed && this.points.length > 1) {
            const last = this.points[this.points.length - 1];
            const first = this.points[0];
            const lastType = last.type ?? 'directional';
            const firstType = first.type ?? 'directional';
            const cp1 = lastType === 'corner' ? last.anchor : (last.cp2 ?? last.anchor);
            const cp2 = firstType === 'corner' ? first.anchor : (first.cp1 ?? first.anchor);
            const anchor = first.anchor;
            this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, anchor.x, anchor.y);
            this.path2D.closePath();
        }
    }
    translate(dx, dy, f) {
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
        this.eventListeners['move']?.forEach(handler => handler({ dx, dy }));
        if (f) {
            return {
                id: this.id,
                from: {
                    cx: this.original.cx,
                    cy: this.original.cy,
                    points: deepClone(this.original.points),
                },
                to: {
                    cx: this.cx,
                    cy: this.cy,
                    points: deepClone(this.points),
                },
            };
        }
    }
    rotateFrom(rotation, anchor, f) {
        const { cx, cy, points } = this.original;
        const newPoints = ElementPath._rotateBezierPointsFrom(anchor.x, anchor.y, rotation, points);
        const { x, y } = rotatePointAroundPoint(cx, cy, anchor.x, anchor.y, rotation);
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
                    points: deepClone(this.original.points),
                },
                to: {
                    cx: this.cx,
                    cy: this.cy,
                    rotation: this.rotation,
                    points: deepClone(this.points),
                },
            };
        }
    }
    scaleFrom(scaleX, scaleY, anchor) {
        console.log(anchor.x, anchor.y);
        const matrix = new DOMMatrix()
            .translate(anchor.x, anchor.y)
            // .rotate(-this.original.rotation)
            .scale(scaleX, scaleY)
            // .rotate(this.original.rotation)
            .translate(-anchor.x, -anchor.y);
        this.points = this.original.points.map(({ anchor, cp1, cp2, type, symmetric }) => {
            const newAnchor = new DOMPoint(anchor.x, anchor.y).matrixTransform(matrix);
            const newCP1 = cp1 ? new DOMPoint(cp1.x, cp1.y).matrixTransform(matrix) : null;
            const newCP2 = cp2 ? new DOMPoint(cp2.x, cp2.y).matrixTransform(matrix) : null;
            const _cp1 = newCP1 ? {
                x: newCP1.x,
                y: newCP1.y,
            } : null;
            const _cp2 = newCP2 ? {
                x: newCP2.x,
                y: newCP2.y,
            } : null;
            return {
                type,
                symmetric,
                anchor: { x: newAnchor.x, y: newAnchor.y },
                cp1: _cp1,
                cp2: _cp2,
            };
        });
        const newCenter = new DOMPoint(this.original.cx, this.original.cy).matrixTransform(matrix);
        this.cx = newCenter.x;
        this.cy = newCenter.y;
        this.updatePath2D();
        this.updateBoundingRect();
        return {
            id: this.id,
            from: {
                cx: this.original.cx,
                cy: this.original.cy,
                points: deepClone(this.original.points),
            },
            to: {
                cx: this.cx,
                cy: this.cy,
                points: deepClone(this.points),
            },
        };
    }
    getBoundingRect(withoutRotation = false) {
        const { cx, cy, rotation, points } = this;
        const r = withoutRotation ? -rotation : 0;
        const transformedPoints = ElementPath._rotateBezierPointsFrom(cx, cy, r, points);
        return getBoundingRectFromBezierPoints(transformedPoints);
    }
    getBoundingRectFromOriginal(withoutRotation = false) {
        const { cx, cy, rotation, points } = this.original;
        const r = withoutRotation ? -rotation : 0;
        const transformedPoints = ElementPath._rotateBezierPointsFrom(cx, cy, r, points);
        return getBoundingRectFromBezierPoints(transformedPoints);
    }
    toJSON() {
        return {
            type: this.type,
            points: this.points,
            closed: this.closed,
            ...super.toJSON(),
        };
    }
    toMinimalJSON() {
        return {
            type: this.type,
            points: this.points,
            closed: this.closed,
            ...super.toMinimalJSON(),
        };
    }
}
export default ElementPath;
