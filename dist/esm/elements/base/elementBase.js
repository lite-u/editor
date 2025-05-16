import { generateBoundingRectFromTwoPoints } from '../../core/utils.js';
import { DEFAULT_FILL, DEFAULT_OPACITY, DEFAULT_ROTATION, DEFAULT_SHADOW, DEFAULT_STROKE, DEFAULT_TRANSFORM, } from '../defaultProps.js';
import deepClone from '../../core/deepClone.js';
import { isEqual } from '../../lib/lib.js';
class ElementBase {
    stroke;
    fill;
    opacity;
    shadow;
    rotation;
    transform;
    show;
    matrix = new DOMMatrix();
    path2D = new Path2D();
    constructor({ stroke = deepClone(DEFAULT_STROKE), fill = deepClone(DEFAULT_FILL), opacity = deepClone(DEFAULT_OPACITY), shadow = deepClone(DEFAULT_SHADOW), rotation = deepClone(DEFAULT_ROTATION), transform = deepClone(DEFAULT_TRANSFORM), show = true, }) {
        this.stroke = stroke;
        this.fill = fill;
        this.opacity = opacity;
        this.shadow = shadow;
        this.rotation = rotation;
        this.transform = transform;
        this.show = show;
    }
    rotate(angle) {
        this.rotation = angle;
    }
    transformPoint(x, y, matrix) {
        const p = matrix.transformPoint({ x, y });
        return { x: p.x, y: p.y };
    }
    toJSON() {
        const { show, stroke, fill, opacity, shadow, rotation, transform, } = this;
        return {
            show,
            stroke: deepClone(stroke),
            fill: deepClone(fill),
            opacity: opacity,
            shadow: deepClone(shadow),
            rotation: rotation,
            transform: deepClone(transform),
        };
    }
    toMinimalJSON() {
        const result = {};
        if (!this.show) {
            result.show = false;
        }
        if (!isEqual(this.stroke, DEFAULT_STROKE)) {
            result.stroke = deepClone(this.stroke);
        }
        if (!isEqual(this.fill, DEFAULT_FILL)) {
            result.fill = deepClone(this.fill);
        }
        if (!isEqual(this.opacity, DEFAULT_OPACITY)) {
            result.opacity = this.opacity;
        }
        if (!isEqual(this.shadow, DEFAULT_SHADOW)) {
            result.shadow = deepClone(this.shadow);
        }
        if (!isEqual(this.rotation, DEFAULT_ROTATION)) {
            result.rotation = this.rotation;
        }
        if (!isEqual(this.transform, DEFAULT_TRANSFORM)) {
            result.transform = deepClone(this.transform);
        }
        return result;
    }
    getBoundingRect() {
        return generateBoundingRectFromTwoPoints({ x: 0, y: 0 }, { x: 0, y: 0 });
    }
    getTransformedPoints() {
        return [];
    }
    getCenter() {
        return { x: 0, y: 0 };
    }
    resetTransform() {
        this.matrix = new DOMMatrix();
    }
    applyTransform(matrix) {
        this.matrix = matrix.multiply(this.matrix);
    }
    getTransformMatrix() {
        return this.matrix;
    }
    render(ctx) {
        if (!this.path2D)
            return;
        let { show, opacity, fill, stroke } = this;
        const { enabled: enabledFill, color: fillColor } = fill;
        const { enabled: enabledStroke, color: strokeColor, weight, join, /*dashed*/ } = stroke;
        if (!show || opacity <= 0)
            return;
        ctx.save();
        if (opacity < 100) {
            ctx.globalAlpha = opacity / 100;
        }
        if (enabledFill) {
            ctx.fillStyle = fillColor;
            ctx.fill(this.path2D);
        }
        if (enabledStroke && weight > 0) {
            ctx.lineWidth = weight;
            // console.log(weight,strokeColor)
            ctx.strokeStyle = strokeColor;
            ctx.lineJoin = join;
            ctx.stroke(this.path2D);
        }
        ctx.restore();
    }
}
export default ElementBase;
