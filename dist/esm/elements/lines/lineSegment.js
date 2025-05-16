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
    get getPoints() {
        return this.points.map(p => ({ x: p.x, y: p.y }));
    }
    updatePath2D() {
        const [start, end] = this.points;
        this.path2D = new Path2D();
        this.path2D.moveTo(start.x, start.y);
        this.path2D.lineTo(end.x, end.y);
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
        // console.log(scaleX, scaleY, newStart, newEnd)
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
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.restore();
    }
}
export default ElementLineSegment;
