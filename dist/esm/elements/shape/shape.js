import ElementBase from '../base/elementBase';
import { DEFAULT_CX, DEFAULT_CY, DEFAULT_GRADIENT } from '~/elements/defaultProps';
import { isEqual } from '~/lib/lib';
import deepClone from '~/core/deepClone';
class ElementShape extends ElementBase {
    cx;
    cy;
    gradient;
    original;
    constructor({ cx = DEFAULT_CX, cy = DEFAULT_CY, gradient = DEFAULT_GRADIENT, ...rest }) {
        super(rest);
        this.cx = cx;
        this.cy = cy;
        this.original = {
            cx: this.cx,
            cy: this.cy,
            rotation: this.rotation,
        };
        this.gradient = gradient;
    }
    translate(dx, dy, f) {
        this.cx = this.cx + dx;
        this.cy = this.cy + dy;
        this.updatePath2D();
        if (f) {
            return {
                id: this.id,
                from: {
                    cx: this.original.cx,
                    cy: this.original.cy,
                },
                to: {
                    cx: this.cx,
                    cy: this.cy,
                },
            };
        }
    }
    rotateFrom(rotation, anchor) {
        const matrix = new DOMMatrix()
            .translate(anchor.x, anchor.y)
            .rotate(rotation)
            .translate(-anchor.x, -anchor.y);
        const { cx, cy } = this.original;
        const transformed = matrix.transformPoint({ x: cx, y: cy });
        this.cx = transformed.x;
        this.cy = transformed.y;
        this.rotation = this.original.rotation + rotation;
        this.updatePath2D();
        // return this
    }
    get center() {
        return { x: this.cx, y: this.cy };
    }
    toJSON() {
        const { cx, cy, gradient, } = this;
        return {
            ...super.toJSON(),
            cx,
            cy,
            gradient: deepClone(gradient),
        };
    }
    toMinimalJSON() {
        const result = {
            ...super.toMinimalJSON(),
        };
        if (this.cx !== DEFAULT_CX) {
            result.cx = this.cx;
        }
        if (this.cy !== DEFAULT_CY) {
            result.cy = this.cy;
        }
        if (!isEqual(this.gradient, DEFAULT_GRADIENT)) {
            result.gradient = deepClone(this.gradient);
        }
        return result;
    }
}
export default ElementShape;
