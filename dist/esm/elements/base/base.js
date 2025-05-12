import { generateBoundingRectFromTwoPoints } from '../../core/utils.js';
const DEFAULT_ENABLE_LINE = true;
const DEFAULT_LINE_COLOR = '#000';
const DEFAULT_LINE_WIDTH = 1;
const DEFAULT_OPACITY = 100;
const DEFAULT_ROTATION = 0;
const DEFAULT_ENABLE_SHADOW = false;
const DEFAULT_SHADOW = '';
class Base {
    rotation;
    enableLine;
    lineWidth;
    lineColor;
    opacity;
    enableShadow;
    shadow;
    constructor({ enableLine = DEFAULT_ENABLE_LINE, lineColor = DEFAULT_LINE_COLOR, lineWidth = DEFAULT_LINE_WIDTH, opacity = DEFAULT_OPACITY, rotation = DEFAULT_ROTATION, enableShadow = DEFAULT_ENABLE_SHADOW, shadow = DEFAULT_SHADOW, }) {
        this.enableLine = enableLine;
        this.lineColor = lineColor;
        this.lineWidth = lineWidth;
        this.opacity = opacity;
        this.rotation = rotation;
        this.enableShadow = enableShadow;
        this.shadow = shadow;
    }
    toJSON() {
        const { enableLine, lineColor, lineWidth, opacity, enableShadow, shadow, rotation, } = this;
        return {
            enableLine,
            lineColor,
            lineWidth,
            opacity,
            enableShadow,
            shadow,
            rotation,
        };
    }
    toMinimalJSON() {
        const result = {};
        if (this.enableLine !== DEFAULT_ENABLE_LINE) {
            result.enableLine = this.enableLine;
        }
        if (this.lineColor !== DEFAULT_LINE_COLOR) {
            result.lineColor = this.lineColor;
        }
        if (this.lineWidth !== DEFAULT_LINE_WIDTH) {
            result.lineWidth = this.lineWidth;
        }
        if (this.opacity !== DEFAULT_OPACITY) {
            result.opacity = this.opacity;
        }
        if (this.enableShadow !== DEFAULT_ENABLE_SHADOW) {
            result.enableShadow = this.enableShadow;
        }
        if (this.shadow !== DEFAULT_SHADOW) {
            result.shadow = this.shadow;
        }
        if (this.rotation !== DEFAULT_ROTATION) {
            result.rotation = this.rotation;
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
