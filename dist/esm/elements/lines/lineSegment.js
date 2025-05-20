import ElementBase from '~/elements/base/elementBase';
import deepClone from '~/core/deepClone';
import { generateBoundingRectFromRect, generateBoundingRectFromRotatedRect } from '~/core/utils';
class ElementLineSegment extends ElementBase {
    // readonly id: string
    // readonly layer: number
    type = 'lineSegment';
    points;
    original;
    constructor({ 
    // id,
    // layer,
    points, ...rest }) {
        super(rest);
        // this.id = id
        // this.layer = layer
        this.points = points;
        this.original = {
            points: deepClone(points),
            rotation: this.rotation,
        };
        this.updatePath2D();
    }
    updatePath2D() {
        const [start, end] = this.points;
        /* const cx = (start.x + end.x) / 2
         const cy = (start.y + end.y) / 2
         console.log(cx, cy)
         let s = {...start}
         let e = {...end}
    
         if (this.rotation !== 0) {
           const matrix = new DOMMatrix()
             .translate(cx, cy)
             .rotate(this.rotation)
             .translate(-cx, -cy)
    
           s = this.transformPoint(start.x, start.y, matrix)
           e = this.transformPoint(end.x, end.y, matrix)
         }
     */
        this.path2D = new Path2D();
        this.path2D.moveTo(start.x, start.y);
        this.path2D.lineTo(end.x, end.y);
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
        this.updatePath2D();
    }
    rotateFrom(rotation, anchor, f) {
        if (rotation !== 0) {
            const matrix = new DOMMatrix()
                .translate(anchor.x, anchor.y)
                .rotate(rotation)
                .translate(-anchor.x, -anchor.y);
            const [oStart, oEnd] = this.original.points;
            const newStart = this.transformPoint(oStart.x, oStart.y, matrix);
            const newEnd = this.transformPoint(oEnd.x, oEnd.y, matrix);
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
