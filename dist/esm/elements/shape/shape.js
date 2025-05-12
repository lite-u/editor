import Base from '../base/base.js';
import { HANDLER_OFFSETS } from '../handleBasics.js';
import { rotatePoint } from '../../lib/lib.js';
import ElementRectangle from '../rectangle/rectangle.js';
const DEFAULT_CX = 0;
const DEFAULT_CY = 0;
const DEFAULT_ENABLE_GRADIENT = false;
const DEFAULT_GRADIENT = '';
const DEFAULT_ENABLE_FILL = true;
const DEFAULT_FILL_COLOR = '#fff';
const DEFAULT_DASH_LINE = '';
class Shape extends Base {
    cx;
    cy;
    fillColor;
    enableFill;
    enableGradient;
    gradient;
    dashLine;
    constructor({ cx = DEFAULT_CX, cy = DEFAULT_CY, enableGradient = DEFAULT_ENABLE_GRADIENT, gradient = DEFAULT_GRADIENT, enableFill = DEFAULT_ENABLE_FILL, fillColor = DEFAULT_FILL_COLOR, dashLine = DEFAULT_DASH_LINE, ...rest }) {
        super(rest);
        this.cx = cx;
        this.cy = cy;
        this.fillColor = fillColor;
        this.enableFill = enableFill;
        this.enableGradient = enableGradient;
        this.gradient = gradient;
        this.dashLine = dashLine;
    }
    toJSON() {
        const { cx, cy, fillColor, enableFill, enableGradient, gradient, dashLine, } = this;
        return {
            ...super.toJSON(),
            cx,
            cy,
            fillColor,
            enableFill,
            enableGradient,
            gradient,
            dashLine,
        };
    }
    toMinimalJSON() {
        const result = {
            ...super.toMinimalJSON(),
        };
        if (this.cx === DEFAULT_CX) {
            result.cx = this.cx;
        }
        if (this.cy === DEFAULT_CY) {
            result.cy = this.cy;
        }
        if (this.enableGradient === DEFAULT_ENABLE_GRADIENT) {
            result.enableGradient = this.enableGradient;
        }
        if (this.gradient === DEFAULT_GRADIENT) {
            result.gradient = this.gradient;
        }
        if (this.enableFill === DEFAULT_ENABLE_FILL) {
            result.enableFill = this.enableFill;
        }
        if (this.fillColor === DEFAULT_FILL_COLOR) {
            result.fillColor = this.fillColor;
        }
        if (this.dashLine === DEFAULT_DASH_LINE) {
            result.dashLine = this.dashLine;
        }
        return result;
    }
    move(x, y) {
        this.cx += x;
        this.cy += y;
    }
    getOperators(id, resizeConfig, rotateConfig, boundingRect, moduleOrigin) {
        const { x: cx, y: cy, width, height } = boundingRect;
        // const id = this.id
        const { rotation } = this;
        const handlers = HANDLER_OFFSETS.map((OFFSET, index) => {
            // Calculate the handle position in local coordinates
            const currentCenterX = cx - width / 2 + OFFSET.x * width;
            const currentCenterY = cy - height / 2 + OFFSET.y * height;
            const currentElementProps = {
                id: '',
                layer: 0,
                // width: 0,
                // height: 0,
                // x: currentCenterX,
                // y: currentCenterY,
                // lineColor: '',
                // lineWidth: 0,
                rotation,
            };
            // let cursor: ResizeCursor = OFFSET.cursor as ResizeCursor
            if (OFFSET.type === 'resize') {
                const rotated = rotatePoint(currentCenterX, currentCenterY, cx, cy, rotation);
                // cursor = getCursor(rotated.x, rotated.y, cx, cy, rotation)
                currentElementProps.id = index + '-resize';
                currentElementProps.cx = rotated.x;
                currentElementProps.cy = rotated.y;
                currentElementProps.width = resizeConfig.size;
                currentElementProps.height = resizeConfig.size;
                currentElementProps.lineWidth = resizeConfig.lineWidth;
                currentElementProps.lineColor = resizeConfig.lineColor;
                currentElementProps.fillColor = resizeConfig.fillColor;
            }
            else if (OFFSET.type === 'rotate') {
                const currentRotateHandlerCenterX = currentCenterX + OFFSET.offsetX * resizeConfig.lineWidth;
                const currentRotateHandlerCenterY = currentCenterY + OFFSET.offsetY * resizeConfig.lineWidth;
                const rotated = rotatePoint(currentRotateHandlerCenterX, currentRotateHandlerCenterY, cx, cy, rotation);
                currentElementProps.id = index + '-rotate';
                currentElementProps.cx = rotated.x;
                currentElementProps.cy = rotated.y;
                currentElementProps.width = rotateConfig.size;
                currentElementProps.height = rotateConfig.size;
                currentElementProps.lineWidth = rotateConfig.lineWidth;
                currentElementProps.lineColor = rotateConfig.lineColor;
                currentElementProps.fillColor = rotateConfig.fillColor;
            }
            return {
                id: `${id}`,
                type: OFFSET.type,
                name: OFFSET.name,
                // cursor,
                moduleOrigin,
                module: new ElementRectangle(currentElementProps),
            };
        });
        return handlers;
    }
    isInsideRect(outer) {
        const inner = this.getBoundingRect();
        return (inner.left >= outer.left &&
            inner.right <= outer.right &&
            inner.top >= outer.top &&
            inner.bottom <= outer.bottom);
    }
}
export default Shape;
