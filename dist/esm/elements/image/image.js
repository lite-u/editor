import Rectangle from '../rectangle/rectangle.js';
import renderer from './renderer.js';
class ElementImage extends Rectangle {
    // readonly type = 'image'
    src;
    constructor({ src, ...rest }) {
        super(rest);
        this.src = src;
    }
    get type() {
        return 'image';
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
        };
    }
    getOperators(id, resizeConfig, rotateConfig) {
        return super.getOperators(id, resizeConfig, rotateConfig);
    }
    render(ctx, img) {
        super.render(ctx);
        renderer(this, ctx, img);
    }
}
export default ElementImage;
