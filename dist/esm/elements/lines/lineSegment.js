import ElementBase from '../base/elementBase.js';
import { generateBoundingRectFromRect, generateBoundingRectFromRotatedRect } from '../../core/utils.js';
class ElementLineSegment extends ElementBase {
    type = 'lineSegment';
    // points: [{ id: 'start' } & Point, { id: 'end' } & Point]
    start;
    end;
    constructor({ start, end, ...rest }) {
        super(rest);
        this.start = { ...start };
        this.end = { ...end };
        this.original = {
            ...this.original,
            start: { ...start },
            end: { ...end },
            rotation: this.rotation,
        };
        this.updatePath2D();
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
            return generateBoundingRectFromRect({ x, y, width, height });
        }
        return generateBoundingRectFromRotatedRect({ x, y, width, height }, rotation);
    }
    updatePath2D() {
        const { cx, cy, start, end, rotation } = this;
        const matrix = new DOMMatrix()
            .translate(cx, cy)
            .rotate(rotation)
            .translate(-cx, -cy);
        const rotatedStart = ElementBase.transformPoint(start.x, start.y, matrix);
        const rotatedEnd = ElementBase.transformPoint(end.x, end.y, matrix);
        this.path2D = new Path2D();
        this.path2D.moveTo(rotatedStart.x, rotatedStart.y);
        this.path2D.lineTo(rotatedEnd.x, rotatedEnd.y);
    }
    updateOriginal() {
        this.original.cx = this.cx;
        this.original.cy = this.cy;
        this.original.start = { ...this.start };
        this.original.end = { ...this.end };
        this.original.rotation = this.rotation;
        this.updatePath2D();
    }
    /*
      public get getPoints(): Point[] {
        return this.points.map(p => ({x: p.x, y: p.y}))
      }
    */
    getBoundingRect(withoutRotation = false) {
        const { start, end, rotation } = this;
        return ElementLineSegment._getBoundingRect(start, end, rotation);
    }
    getBoundingRectFromOriginal() {
        const { start, end, rotation } = this.original;
        return ElementLineSegment._getBoundingRect(start, end, rotation);
    }
    scaleFrom(scaleX, scaleY, anchor) {
        const matrix = new DOMMatrix()
            .translate(anchor.x, anchor.y)
            .scale(scaleX, scaleY)
            .translate(-anchor.x, -anchor.y);
        const { start, end } = this.original;
        // Adjust to absolute coordinates for transformation
        const newStart = ElementBase.transformPoint(start.x + this.cx, start.y + this.cy, matrix);
        const newEnd = ElementBase.transformPoint(end.x + this.cx, end.y + this.cy, matrix);
        // Store back as relative to cx, cy
        this.start.x = newStart.x - this.cx;
        this.start.y = newStart.y - this.cy;
        this.end.x = newEnd.x - this.cx;
        this.end.y = newEnd.y - this.cy;
        this.updatePath2D();
    }
    toJSON() {
        return {
            ...super.toJSON(),
            type: this.type,
            start: { ...this.start },
            end: { ...this.end },
        };
    }
    toMinimalJSON() {
        return {
            ...super.toMinimalJSON(),
            type: this.type,
            start: { ...this.start },
            end: { ...this.end },
        };
    }
}
export default ElementLineSegment;
