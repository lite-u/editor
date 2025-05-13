import Base from '../base/base.js';
import { HANDLER_OFFSETS } from '../handleBasics.js';
import ElementRectangle from '../rectangle/rectangle.js';
import { rotatePointAroundPoint } from '../../core/geometry.js';
import { DEFAULT_CX, DEFAULT_CY, DEFAULT_GRADIENT } from '../defaultProps.js';
import { isEqual } from '../../lib/lib.js';
import deepClone from '../../core/deepClone.js';
class Shape extends Base {
    cx;
    cy;
    gradient;
    constructor({ cx = DEFAULT_CX, cy = DEFAULT_CY, gradient = DEFAULT_GRADIENT, ...rest }) {
        super(rest);
        this.cx = cx;
        this.cy = cy;
        this.gradient = gradient;
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
    move(x, y) {
        this.cx += x;
        this.cy += y;
    }
    getOperators(id, resizeConfig, rotateConfig, boundingRect, elementOrigin) {
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
                const rotated = rotatePointAroundPoint(currentCenterX, currentCenterY, cx, cy, rotation);
                // cursor = getCursor(rotated.x, rotated.y, cx, cy, rotation)
                currentElementProps.id = index + '-resize';
                currentElementProps.cx = rotated.x;
                currentElementProps.cy = rotated.y;
                currentElementProps.width = resizeConfig.size;
                currentElementProps.height = resizeConfig.size;
                currentElementProps.stroke = {
                    weight,
                };
                currentElementProps.stroke.weight = resizeConfig.stroke?.weight;
                currentElementProps.lineColor = resizeConfig.lineColor;
                currentElementProps.fillColor = resizeConfig.fillColor;
            }
            else if (OFFSET.type === 'rotate') {
                const currentRotateHandlerCenterX = currentCenterX + OFFSET.offsetX * resizeConfig.lineWidth;
                const currentRotateHandlerCenterY = currentCenterY + OFFSET.offsetY * resizeConfig.lineWidth;
                const rotated = rotatePointAroundPoint(currentRotateHandlerCenterX, currentRotateHandlerCenterY, cx, cy, rotation);
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
                elementOrigin,
                element: new ElementRectangle(currentElementProps),
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
