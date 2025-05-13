import { generateBoundingRectFromTwoPoints } from '../../core/utils.js';
import { DEFAULT_FILL, DEFAULT_OPACITY, DEFAULT_ROTATION, DEFAULT_SHADOW, DEFAULT_STROKE, DEFAULT_TRANSFORM, } from '../defaultProps.js';
import deepClone from '../../core/deepClone.js';
import { isEqual } from '../../lib/lib.js';
class Base {
    stroke;
    fill;
    opacity;
    shadow;
    rotation;
    transform;
    constructor({ stroke = deepClone(DEFAULT_STROKE), fill = deepClone(DEFAULT_FILL), opacity = deepClone(DEFAULT_OPACITY), shadow = deepClone(DEFAULT_SHADOW), rotation = deepClone(DEFAULT_ROTATION), transform = deepClone(DEFAULT_TRANSFORM), }) {
        this.stroke = stroke;
        this.fill = fill;
        this.opacity = opacity;
        this.shadow = shadow;
        this.rotation = rotation;
        this.transform = transform;
    }
    toJSON() {
        const { stroke, fill, opacity, shadow, rotation, transform, } = this;
        return {
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
    render(_ctx) {
        return undefined;
    }
}
export default Base;
