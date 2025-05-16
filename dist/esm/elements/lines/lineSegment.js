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
        this.original = { points: deepClone(points) };
    }
    getPoints() {
        return Object.values(this.points).map(p => p);
    }
    getBoundingRect() {
        const { points } = this;
        const x = cx - width / 2;
        const y = cy - height / 2;
        if (rotation === 0) {
            return generateBoundingRectFromRect({ x, y, width, height });
        }
        return generateBoundingRectFromRotatedRect({ x, y, width, height }, rotation);
    }
    getBoundingRectFromOriginal() {
        const { cx, cy, width, height, rotation } = this.original;
        const x = cx - width / 2;
        const y = cy - height / 2;
        if (rotation === 0) {
            return generateBoundingRectFromRect({ x, y, width, height });
        }
        return generateBoundingRectFromRotatedRect({ x, y, width, height }, rotation);
    }
    translate(dx, dy) {
        Object.values(this.points).forEach((point) => {
            point.x += dx;
            point.y += dy;
        });
    }
    scaleFrom(scaleX, scaleY, anchor) {
        const matrix = new DOMMatrix()
            .translate(anchor.x, anchor.y)
            .scale(scaleX, scaleY)
            .translate(-anchor.x, -anchor.y);
        const newStart = this.transformPoint(this.original.points.start.x, this.original.points.start.y, matrix);
        const newEnd = this.transformPoint(this.original.points.end.x, this.original.points.end.y, matrix);
        this.points.start = newStart;
        this.points.end = newEnd;
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
        const { start, end } = this.points;
        ctx.save();
        ctx.beginPath(); // Start a new path
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.restore();
    }
}
export default ElementLineSegment;
