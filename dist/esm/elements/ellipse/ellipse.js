import { generateBoundingRectFromRotatedRect } from '../../core/utils.js';
import Shape from '../shape/shape.js';
import Rectangle from '../rectangle/rectangle.js';
import render from './render.js';
import transform from './transform.js';
class Ellipse extends Shape {
    type = 'ellipse';
    // horizontal
    r1;
    // vertical
    r2;
    constructor({ r1, r2, ...rest }) {
        super(rest);
        this.r1 = r1;
        this.r2 = r2;
    }
    static applyResizeTransform = (props) => {
        return transform(props);
    };
    hitTest(point, borderPadding = 5) {
        const { cx: cx, cy: cy, r1, r2, rotation = 0 } = this;
        const cos = Math.cos(-rotation);
        const sin = Math.sin(-rotation);
        const dx = point.x - cx;
        const dy = point.y - cy;
        const localX = dx * cos - dy * sin;
        const localY = dx * sin + dy * cos;
        // Ellipse equation: (x^2 / a^2) + (y^2 / b^2)
        const norm = (localX * localX) / (r1 * r1) + (localY * localY) / (r2 * r2);
        const borderRange = borderPadding / Math.min(r1, r2); // normalized padding
        if (norm <= 1 + borderRange) {
            if (norm >= 1 - borderRange) {
                return 'border';
            }
            return 'inside';
        }
        return null;
    }
    toMinimalJSON() {
        return {
            ...super.toMinimalJSON(),
            type: 'ellipse',
            r1: this.r1,
            r2: this.r2,
        };
    }
    toJSON() {
        return {
            ...super.toJSON(),
            type: 'ellipse',
            r1: this.r1,
            r2: this.r2,
        };
    }
    getBoundingRect() {
        const { cx: cx, cy: cy, r1, r2, rotation } = this;
        return generateBoundingRectFromRotatedRect({
            x: cx - r1,
            y: cy - r2,
            width: r1 * 2,
            height: r2 * 2,
        }, rotation);
    }
    getSelectedBoxModule(lineWidth, lineColor) {
        const { id, rotation, layer } = this;
        const rectProp = {
            ...this.getRect(),
            lineColor,
            lineWidth,
            rotation,
            layer,
            id: id + '-selected-box',
            opacity: 0,
        };
        return new Rectangle(rectProp);
    }
    getHighlightModule(lineWidth, lineColor) {
        const { cx, cy, r1, r2, rotation, layer, id } = this;
        return new Ellipse({
            cx: cx,
            cy: cy,
            r1,
            r2,
            lineColor,
            lineWidth,
            rotation,
            layer,
            id: id + 'highlight',
            opacity: 0,
        });
    }
    getOperators(id, resizeConfig, rotateConfig) {
        return super.getOperators(id, resizeConfig, rotateConfig, this.getRect(), this.toMinimalJSON(true));
    }
    getSnapPoints() {
        const { cx: cx, cy: cy, r1, r2 } = this;
        // Define snap points: center, cardinal edge points (top, right, bottom, left)
        const points = [
            { id, x: cx, y: cy, type: 'center' },
            { id, x: cx, y: cy - r2, type: 'edge-top' },
            { id, x: cx + r1, y: cy, type: 'edge-right' },
            { id, x: cx, y: cy + r2, type: 'edge-bottom' },
            { id, x: cx - r1, y: cy, type: 'edge-left' },
        ];
        return points;
    }
    render(ctx) {
        render(this, ctx);
    }
}
export default Ellipse;
