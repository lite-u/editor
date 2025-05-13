import render from './render.js';
import RectangleLike from '../rectangle/rectangleLike.js';
import deepClone from '../../core/deepClone.js';
class ElementImage extends RectangleLike {
    type = 'image';
    asset;
    constructor({ asset, ...rest }) {
        super(rest);
        this.asset = asset;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            asset: deepClone(this.asset),
            type: this.type,
        };
    }
    toMinimalJSON() {
        return {
            ...super.toMinimalJSON(),
            asset: deepClone(this.asset),
            type: this.type,
        };
    }
    render(ctx) {
        render.call(this, ctx);
    }
}
export default ElementImage;
