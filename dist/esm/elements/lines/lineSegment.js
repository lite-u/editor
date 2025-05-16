import ElementBase from '../base/elementBase.js';
import deepClone from '../../core/deepClone.js';
import { generateBoundingRectFromRect, generateBoundingRectFromRotatedRect } from '../../core/utils.js';
class ElementLineSegment extends ElementBase {
    id;
    layer;
    type = 'lineSegment';
    points;
    original;
    constructor({ id, layer, points, ...rest }) {
        super(rest);
        this.id = id;
        this.layer = layer;
        this.points = points;
        this.original = {
            points: deepClone(points),
            rotation: this.rotation,
        };
    }
    getPoints() {
        return Object.values(this.points).map(p => p);
    }
    static _getBoundingRect(start, end, rotation) {
        const x = Math.min(start.x, end.x);
        const y = Math.min(start.y, end.y);
        const width = Math.abs(end.x - start.x);
        const height = Math.abs(end.y - start.y);
        if (rotation === 0) {
            return generateBoundingRectFromRect({ x, y, width, height });
        }
        return generateBoundingRectFromRotatedRect({ x, y, width, height }, rotation);
    }
    getBoundingRect() {
        const [start, end] = this.points;
        return ElementLineSegment._getBoundingRect(start, end, this.rotation);
    }
    getBoundingRectFromOriginal() {
        const [start, end] = this.original.points;
        return ElementLineSegment._getBoundingRect(start, end, this.original.rotation);
    }
    translate(dx, dy) {
        this.points.forEach((point) => {
            point.x += dx;
            point.y += dy;
        });
    }
    scaleFrom(scaleX, scaleY, anchor) {
        const [start, end] = this.points;
        const [oStart, oEnd] = this.original.points;
        const matrix = new DOMMatrix()
            .translate(anchor.x, anchor.y)
            .scale(scaleX, scaleY)
            .translate(-anchor.x, -anchor.y);
        const newStart = this.transformPoint(oStart.x, oStart.y, matrix);
        const newEnd = this.transformPoint(oEnd.x, oEnd.y, matrix);
        start.x = newStart.x;
        start.y = newStart.y;
        end.x = newEnd.x;
        end.y = newEnd.y;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            id: this.id,
            layer: this.layer,
            type: this.type,
            points: deepClone(this.points),
        };
    }
    toMinimalJSON() {
        return {
            ...super.toMinimalJSON(),
            id: this.id,
            layer: this.layer,
            type: this.type,
            points: deepClone(this.points),
        };
    }
    render(ctx) {
        const [start, end] = this.points;
        ctx.save();
        ctx.beginPath(); // Start a new path
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.restore();
    }
}
export default ElementLineSegment;
