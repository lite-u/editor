import RectangleLike from './rectangleLike.js';
class ElementRectangle extends RectangleLike {
    type = 'rectangle';
    constructor(props) {
        super(props);
        this.updatePath2D();
        this.updateBoundingRect();
    }
    static create(id, cx, cy, width = 10, height) {
        const _height = height || width;
        const props = {
            id,
            width,
            cx,
            cy,
            height: _height,
            layer: 0,
        };
        return new ElementRectangle(props);
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
}
export default ElementRectangle;
