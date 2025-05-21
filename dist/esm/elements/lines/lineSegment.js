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
        const [start, end] = this.points;
        const startX = start.x + this.cx;
        const startY = start.y + this.cy;
        const endX = end.x + this.cx;
        const endY = end.y + this.cy;
        this.path2D = new Path2D();
        this.path2D.moveTo(startX, startY);
        this.path2D.lineTo(endX, endY);
    }
    updateOriginal() {
        this.original.points = deepClone(this.points);
        this.original.rotation = this.rotation;
        this.updatePath2D();
    }
    get center() {
        const rect = this.getBoundingRect();
        return { x: rect.cx, y: rect.cy };
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
        // console.log(width, height)
        if (rotation === 0) {
            return generateBoundingRectFromRect({ x, y, width, height });
        }
        return generateBoundingRectFromRotatedRect({ x, y, width, height }, rotation);
    }
    getBoundingRect() {
        const [start, end] = this.points;
        return ElementLineSegment._getBoundingRect(start, end);
    }
    getBoundingRectFromOriginal() {
        const [start, end] = this.original.points;
        return ElementLineSegment._getBoundingRect(start, end);
    }
    translate(dx, dy, f) {
        this.points.forEach((point) => {
            point.x += dx;
            point.y += dy;
        });
        if (f) {
            return {
                id: this.id,
                from: {
                    points: deepClone(this.original.points),
                },
                to: {
                    points: deepClone(this.points),
                },
            };
        }
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
    rotateFrom(rotation, anchor, f) {
        if (rotation !== 0) {
            const matrix = new DOMMatrix()
                .translate(anchor.x, anchor.y)
                .rotate(rotation)
                .translate(-anchor.x, -anchor.y);
            const [oStart, oEnd] = this.original.points;
            const newStart = ElementBase.transformPoint(oStart.x, oStart.y, matrix);
            const newEnd = ElementBase.transformPoint(oEnd.x, oEnd.y, matrix);
            this.points[0].x = newStart.x;
            this.points[0].y = newStart.y;
            this.points[1].x = newEnd.x;
            this.points[1].y = newEnd.y;
            let newRotation = (this.original.rotation + rotation) % 360;
            if (newRotation < 0)
                newRotation += 360;
            this.rotation = newRotation;
            this.updatePath2D();
        }
        if (f) {
            return {
                id: this.id,
                from: {
                    points: deepClone(this.original.points),
                    rotation: this.original.rotation,
                },
                to: {
                    points: deepClone(this.points),
                    rotation: this.rotation,
                },
            };
        }
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
