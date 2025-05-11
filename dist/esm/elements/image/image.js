import render from './render.js';
import RectangleLike from '../rectangle/rectangleLike.js';
const DEFAULT_SRC = '';
class ElementImage extends RectangleLike {
    type = 'image';
    src;
    constructor({ src = DEFAULT_SRC, ...rest }) {
        super(rest);
        this.src = src;
    }
    toJSON() {
        return {
            src: this.src,
            type: this.type,
            ...super.toJSON(),
        };
    }
    toMinimalJSON() {
        return {
            ...super.toMinimalJSON(),
            src: this.src,
            type: this.type,
        };
    }
    renderImage(ctx, img) {
        render.call(this, ctx, img);
    }
}
export default ElementImage;
