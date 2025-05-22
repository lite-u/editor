import RectangleLike from './rectangleLike.js';
class ElementRectangle extends RectangleLike {
    type = 'rectangle';
    constructor(props) {
        super(props);
    }
    static create(p, width = 10, height) {
        const _height = height || width;
        const props = {
            cx: p.x,
            cy: p.y,
            width,
            height: _height,
        };
    }
    toJSON() {
        return {
            ...super.toJSON(),
            type: this.type,
        };
    }
    toMinimalJSON() {
        return {
            ...super.toMinimalJSON(),
            type: this.type,
        };
    }
    getRect() {
        const { cx, cy, width, height } = this;
        return {
            cx,
            cy,
            width,
            height,
        };
    }
}
export default ElementRectangle;
