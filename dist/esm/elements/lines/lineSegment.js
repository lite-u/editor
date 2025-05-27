import ElementBase from '../base/elementBase.js';
import { generateBoundingRectFromRect, generateBoundingRectFromRotatedRect } from '../../core/utils.js';
import deepClone from '../../core/deepClone.js';
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
        const r = withoutRotation ? -rotation : 0;
        return ElementLineSegment._getBoundingRect(start, end, r);
    }
    getBoundingRectFromOriginal() {
        const { start, end, rotation } = this.original;
        return ElementLineSegment._getBoundingRect(start, end, rotation);
    }
    translate(dx, dy, f = false) {
        this.cx = this.cx + dx;
        this.cy = this.cy + dy;
        this.start.x += dx;
        this.start.y += dy;
        this.end.x += dx;
        this.end.y += dy;
        this.updatePath2D();
        this.eventListeners['move']?.forEach(handler => handler({ dx, dy }));
        if (f) {
            return {
                id: this.id,
                from: {
                    cx: this.original.cx,
                    cy: this.original.cy,
                    start: deepClone(this.original.start),
                    end: deepClone(this.original.end),
                },
                to: {
                    cx: this.cx,
                    cy: this.cy,
                    start: deepClone(this.start),
                    end: deepClone(this.end),
                },
            };
        }
    }
    scaleFrom(scaleX, scaleY, anchor) {
        const matrix = new DOMMatrix()
            .translate(anchor.x, anchor.y)
            .scale(scaleX, scaleY)
            .translate(-anchor.x, -anchor.y);
        const { start, end } = this.original;
        // Adjust to absolute coordinates for transformation
        const newStart = ElementBase.transformPoint(start.x, start.y, matrix);
        const newEnd = ElementBase.transformPoint(end.x, end.y, matrix);
        // Store back as relative to cx, cy
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
