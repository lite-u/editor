import deepClone from '../../core/deepClone.js';
import ElementShape from '../shape/shape.js';
import ElementBase from '../base/elementBase.js';
class ElementPath extends ElementShape {
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
    }
    static cubicBezier(t, p0, p1, p2, p3) {
        const mt = 1 - t;
        const mt2 = mt * mt;
        const t2 = t * t;
        return {
            x: mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x,
            y: mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y,
        };
    }
    updateOriginal() {
        this.original.cx = this.cx;
        this.original.cy = this.cy;
        this.original.points = deepClone(this.points);
        this.original.closed = this.closed;
        this.original.rotation = this.rotation;
        this.updatePath2D();
    }
    get getPoints() {
        return this.points.map(p => ({ ...p.anchor }));
    }
    updatePath2D() {
        if (this.points.length === 0)
            return;
        this.path2D = new Path2D();
        const { cx, cy } = this;
        const transform = new DOMMatrix()
            .translate(cx, cy)
            .rotate(this.rotation)
            .translate(-cx, -cy);
        const startAnchor = this.points[0].anchor;
        const start = ElementBase.transformPoint(startAnchor.x + cx, startAnchor.y + cy, transform);
        this.path2D.moveTo(start.x, start.y);
        for (let i = 1; i < this.points.length; i++) {
            const prev = this.points[i - 1];
            const curr = this.points[i];
            const cp1 = prev.cp2
                ? ElementBase.transformPoint(prev.cp2.x + cx, prev.cp2.y + cy, transform)
                : ElementBase.transformPoint(prev.anchor.x + cx, prev.anchor.y + cy, transform);
            const cp2 = curr.cp1
                ? ElementBase.transformPoint(curr.cp1.x + cx, curr.cp1.y + cy, transform)
                : ElementBase.transformPoint(curr.anchor.x + cx, curr.anchor.y + cy, transform);
            const anchor = ElementBase.transformPoint(curr.anchor.x + cx, curr.anchor.y + cy, transform);
            this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, anchor.x, anchor.y);
        }
        if (this.closed && this.points.length > 1) {
            const last = this.points[this.points.length - 1];
            const first = this.points[0];
            const cp1 = last.cp2
                ? ElementBase.transformPoint(last.cp2.x + cx, last.cp2.y + cy, transform)
                : ElementBase.transformPoint(last.anchor.x + cx, last.anchor.y + cy, transform);
            const cp2 = first.cp1
                ? ElementBase.transformPoint(first.cp1.x + cx, first.cp1.y + cy, transform)
                : ElementBase.transformPoint(first.anchor.x + cx, first.anchor.y + cy, transform);
            const anchor = ElementBase.transformPoint(first.anchor.x + cx, first.anchor.y + cy, transform);
            this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, anchor.x, anchor.y);
            this.path2D.closePath();
        }
    }
    scaleFrom(scaleX, scaleY, anchor) {
        /*// console.log(scaleX, scaleY, anchor)
        const matrix = new DOMMatrix()
          .translate(anchor.x, anchor.y)
          .scale(scaleX, scaleY)
          .translate(-anchor.x, -anchor.y)
    
        const {cx, cy, width, height} = this.original
        const topLeft = ElementBase.transformPoint(cx - width / 2, cy - height / 2, matrix)
        const bottomRight = ElementBase.transformPoint(cx + width / 2, cy + height / 2, matrix)
    
        this.cx = (topLeft.x + bottomRight.x) / 2
        this.cy = (topLeft.y + bottomRight.y) / 2
        this.width = Math.abs(bottomRight.x - topLeft.x)
        this.height = Math.abs(bottomRight.y - topLeft.y)
    
        this.updatePath2D()*/
        // console.log(this.cx, this.cy, this.width, this.height)
    }
    static _getBoundingRect(points) {
        const samplePoints = [];
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const p0 = prev.anchor;
            const p1 = prev.cp2 ?? prev.anchor;
            const p2 = curr.cp1 ?? curr.anchor;
            const p3 = curr.anchor;
            for (let t = 0; t <= 1; t += 0.05) {
                samplePoints.push(ElementPath.cubicBezier(t, p0, p1, p2, p3));
            }
        }
        if (points.length === 1) {
            samplePoints.push(points[0].anchor);
        }
        const xs = samplePoints.map(p => p.x);
        const ys = samplePoints.map(p => p.y);
        const left = Math.min(...xs);
        const right = Math.max(...xs);
        const top = Math.min(...ys);
        const bottom = Math.max(...ys);
        const width = right - left;
        const height = bottom - top;
        const x = left;
        const y = top;
        const cx = x + width / 2;
        const cy = y + height / 2;
        return { x, y, width, height, left, right, top, bottom, cx, cy };
    }
    static _getBoundingRectFromRelativePoints(cx, cy, rotation, points) {
        const matrix = new DOMMatrix()
            .translate(cx, cy)
            .rotate(rotation)
            .translate(-cx, -cy);
        const transformedPoints = points.map(p => ({
            anchor: rotation
                ? ElementBase.transformPoint(p.anchor.x + cx, p.anchor.y + cy, matrix)
                : { x: p.anchor.x + cx, y: p.anchor.y + cy },
            cp1: p.cp1
                ? (rotation
                    ? ElementPath.transformPoint(p.cp1.x + cx, p.cp1.y + cy, matrix)
                    : { x: p.cp1.x + cx, y: p.cp1.y + cy })
                : undefined,
            cp2: p.cp2
                ? (rotation
                    ? ElementPath.transformPoint(p.cp2.x + cx, p.cp2.y + cy, matrix)
                    : { x: p.cp2.x + cx, y: p.cp2.y + cy })
                : undefined,
        }));
        return ElementPath._getBoundingRect(transformedPoints);
    }
    getBoundingRectFromOriginal() {
        const { cx, cy, rotation, points } = this.original;
        return ElementPath._getBoundingRectFromRelativePoints(cx, cy, rotation, points);
    }
    getBoundingRect(withoutRotation = false) {
        const { cx, cy, rotation, points } = this;
        const r = withoutRotation ? 0 : rotation;
        return ElementPath._getBoundingRectFromRelativePoints(cx, cy, r, points);
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
