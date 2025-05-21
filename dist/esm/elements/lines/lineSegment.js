import ElementBase from '../base/elementBase.js';
import deepClone from '../../core/deepClone.js';
import { generateBoundingRectFromRect, generateBoundingRectFromRotatedRect } from '../../core/utils.js';
class ElementLineSegment extends ElementBase {
    type = 'lineSegment';
    points;
    constructor({ points, ...rest }) {
        super(rest);
        this.points = points;
        this.original = {
            ...this.original,
            points: deepClone(points),
            rotation: this.rotation,
        };
        this.updatePath2D();
    }
    updatePath2D() {
        const { cx, cy, rotation } = this;
        const [start, end] = this.points;
        const absStart = { x: start.x + cx, y: start.y + cy };
        const absEnd = { x: end.x + cx, y: end.y + cy };
        const matrix = new DOMMatrix()
            .translate(cx, cy)
            .rotate(rotation)
            .translate(-cx, -cy);
        const rotatedStart = ElementBase.transformPoint(absStart.x, absStart.y, matrix);
        const rotatedEnd = ElementBase.transformPoint(absEnd.x, absEnd.y, matrix);
        this.path2D = new Path2D();
        this.path2D.moveTo(rotatedStart.x, rotatedStart.y);
        this.path2D.lineTo(rotatedEnd.x, rotatedEnd.y);
    }
    updateOriginal() {
        this.original.cx = this.cx;
        this.original.cy = this.cy;
        this.original.points = deepClone(this.points);
        this.original.rotation = this.rotation;
        this.updatePath2D();
    }
    get getPoints() {
        return this.points.map(p => ({ x: p.x, y: p.y }));
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
            return generateBoundingRectFromRect({ x, y, width, height });
        }
        return generateBoundingRectFromRotatedRect({ x, y, width, height }, rotation);
    }
    getBoundingRect(withoutRotation = false) {
        const { cx, cy, points: [start, end], rotation } = this;
        const aStart = { x: start.x + cx, y: start.y + cy };
        const aEnd = { x: end.x + cx, y: end.y + cy };
        const r = withoutRotation ? 0 : rotation;
        return ElementLineSegment._getBoundingRect(aStart, aEnd, r);
    }
    getBoundingRectFromOriginal() {
        const { cx, cy, points: [start, end], rotation } = this;
        const aStart = { x: start.x + cx, y: start.y + cy };
        const aEnd = { x: end.x + cx, y: end.y + cy };
        return ElementLineSegment._getBoundingRect(aStart, aEnd, rotation);
    }
    scaleFrom(scaleX, scaleY, anchor) {
        const matrix = new DOMMatrix()
            .translate(anchor.x, anchor.y)
            .scale(scaleX, scaleY)
            .translate(-anchor.x, -anchor.y);
        const [oStart, oEnd] = this.original.points;
        // Adjust to absolute coordinates for transformation
        const newStart = ElementBase.transformPoint(oStart.x + this.cx, oStart.y + this.cy, matrix);
        const newEnd = ElementBase.transformPoint(oEnd.x + this.cx, oEnd.y + this.cy, matrix);
        // Store back as relative to cx, cy
        this.points[0].x = newStart.x - this.cx;
        this.points[0].y = newStart.y - this.cy;
        this.points[1].x = newEnd.x - this.cx;
        this.points[1].y = newEnd.y - this.cy;
        this.updatePath2D();
    }
    toJSON() {
        return {
            ...super.toJSON(),
            // id: this.id,
            // layer: this.layer,
            type: this.type,
            points: deepClone(this.points),
        };
    }
    toMinimalJSON() {
        return {
            ...super.toMinimalJSON(),
            // id: this.id,
            // layer: this.layer,
            type: this.type,
            points: deepClone(this.points),
        };
    }
}
export default ElementLineSegment;
