import ElementBase from '../base/elementBase.js';
import deepClone from '../../core/deepClone.js';
class LineSegment extends ElementBase {
    id;
    layer;
    type = 'path';
    points = [];
    original;
    constructor({ id, layer, points = [], ...rest }) {
        super(rest);
        this.id = id;
        this.layer = layer;
        this.points = points;
        this.original = { points: [] };
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
}
export default LineSegment;
