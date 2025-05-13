import Shape from '../shape/shape.js';
import { generateBoundingRectFromRect, generateBoundingRectFromRotatedRect } from '../../core/utils.js';
import render from './render.js';
import transform from './transform.js';
import ElementRectangle from './rectangle.js';
import { DEFAULT_BORDER_RADIUS, DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../defaultProps.js';
import { isEqual } from '../../lib/lib.js';
import { transformPoints } from '../../core/geometry.js';
class RectangleLike extends Shape {
    id;
    layer;
    width;
    height;
    borderRadius;
    original;
    constructor({ id, layer, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, borderRadius = DEFAULT_BORDER_RADIUS, ...rest }) {
        super(rest);
        this.id = id;
        this.layer = layer;
        this.width = width;
        this.height = height;
        this.borderRadius = borderRadius;
        this.original = {
            cx: this.cx,
            cy: this.cy,
            width,
            height,
        };
    }
    getCorners() {
        const { cx, cy, width, height } = this.original;
        const x = cx + width / 2;
        const y = cy + height / 2;
        return [
            { x, y },
            { x: x + width, y: y + height },
            { x: x + width, y: y },
            { x: x + width, y: y + height },
            { x: x, y: y + height },
        ];
    }
    getTransformedPoints() {
        // const {cx, cy, width, height} = this.original
        const corners = this.getCorners();
        return transformPoints(corners, this.matrix);
    }
    static applyResizeTransform = (arg) => {
        return transform(arg);
    };
    hitTest(point, borderPadding = 5) {
        const { cx: cx, cy: cy, width, height, rotation = 0 } = this;
        const rad = rotation * (Math.PI / 180);
        const cos = Math.cos(-rad);
        const sin = Math.sin(-rad);
        const dx = point.x - cx;
        const dy = point.y - cy;
        // Rotate the point into the rectangle's local coordinate system
        const localX = dx * cos - dy * sin;
        const localY = dx * sin + dy * cos;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const withinX = localX >= -halfWidth && localX <= halfWidth;
        const withinY = localY >= -halfHeight && localY <= halfHeight;
        // console.log('hit')
        if (withinX && withinY) {
            const nearLeft = Math.abs(localX + halfWidth) <= borderPadding;
            const nearRight = Math.abs(localX - halfWidth) <= borderPadding;
            const nearTop = Math.abs(localY + halfHeight) <= borderPadding;
            const nearBottom = Math.abs(localY - halfHeight) <= borderPadding;
            if (nearLeft || nearRight || nearTop || nearBottom) {
                return 'border';
            }
            return 'inside';
        }
        return null;
    }
    toJSON() {
        const { borderRadius, width, height, id, layer, } = this;
        if (!borderRadius) {
            debugger;
        }
        return {
            ...super.toJSON(),
            id,
            layer,
            borderRadius: [...borderRadius],
            width,
            height,
        };
    }
    toMinimalJSON() {
        const result = {
            ...super.toMinimalJSON(),
            id: this.id,
            layer: this.layer,
        };
        if (!isEqual(this.borderRadius, DEFAULT_BORDER_RADIUS)) {
            result.borderRadius = [...this.borderRadius];
        }
        if (this.width !== DEFAULT_WIDTH) {
            result.width = this.width;
        }
        if (this.height !== DEFAULT_HEIGHT) {
            result.height = this.height;
        }
        return result;
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
    getBoundingRect() {
        const { cx, cy, width, height, rotation } = this;
        const x = cx - width / 2;
        const y = cy - height / 2;
        if (rotation === 0) {
            return generateBoundingRectFromRect({ x, y, width, height });
        }
        return generateBoundingRectFromRotatedRect({ x, y, width, height }, rotation);
    }
    getSelectedBoxElement(lineWidth, lineColor) {
        return new ElementRectangle({
            ...this.toJSON(),
            lineColor,
            lineWidth,
            id: this.id + '-selected-box',
            opacity: 0,
        });
    }
    getHighlightElement(lineWidth, lineColor) {
        return new ElementRectangle({
            ...this.toJSON(),
            lineColor,
            lineWidth,
            id: this.id + 'highlight',
            opacity: 0,
        });
    }
    getOperators(id, resizeConfig, rotateConfig) {
        return super.getOperators(id, resizeConfig, rotateConfig, this.getBoundingRect(), this.toJSON());
    }
    getSnapPoints() {
        const { cx: cx, cy: cy, width, height, id } = this;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        // Define basic snap points: center, corners, and edge centers
        const points = [
            { id, x: cx, y: cy, type: 'center' },
            { id, x: cx - halfWidth, y: cy - halfHeight, type: 'corner-tl' },
            { id, x: cx + halfWidth, y: cy - halfHeight, type: 'corner-tr' },
            { id, x: cx + halfWidth, y: cy + halfHeight, type: 'corner-br' },
            { id, x: cx - halfWidth, y: cy + halfHeight, type: 'corner-bl' },
            { id, x: cx, y: cy - halfHeight, type: 'edge-top' },
            { id, x: cx + halfWidth, y: cy, type: 'edge-right' },
            { id, x: cx, y: cy + halfHeight, type: 'edge-bottom' },
            { id, x: cx - halfWidth, y: cy, type: 'edge-left' },
        ];
        return points;
    }
    render(ctx) {
        render(this, ctx);
    }
}
export default RectangleLike;
