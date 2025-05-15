import ElementBase from '../base/elementBase.js';
import deepClone from '../../core/deepClone.js';
class ElementLineSegment extends ElementBase {
    id;
    layer;
    type = 'lineSegment';
    points = [];
    original;
    constructor({ id, layer, points = [], ...rest }) {
        super(rest);
        this.id = id;
        this.layer = layer;
        this.points = points;
        this.original = { points: [] };
    }
    translate(dx, dy) {
        this.points.forEach((point) => {
            point.x += dx;
            point.y += dy;
        });
    }
    scaleFrom(scaleX, scaleY, anchor) {
        // console.log(scaleX, scaleY, anchor)
        const matrix = new DOMMatrix()
            .translate(anchor.x, anchor.y)
            .scale(scaleX, scaleY)
            .translate(-anchor.x, -anchor.y);
        /*
            const {cx, cy, width, height} = this.original
            const topLeft = this.transformPoint(cx - width / 2, cy - height / 2, matrix)
            const bottomRight = this.transformPoint(cx + width / 2, cy + height / 2, matrix)
    
            this.cx = (topLeft.x + bottomRight.x) / 2
            this.cy = (topLeft.y + bottomRight.y) / 2
            this.width = Math.abs(bottomRight.x - topLeft.x)
            this.height = Math.abs(bottomRight.y - topLeft.y)*/
        // console.log(this.cx, this.cy, this.width, this.height)
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
    render() {
    }
}
export default ElementLineSegment;
