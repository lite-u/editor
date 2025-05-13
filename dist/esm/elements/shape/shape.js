import Base from '../base/base.js';
import { HANDLER_OFFSETS } from '../handleBasics.js';
import ElementRectangle from '../rectangle/rectangle.js';
import { rotatePointAroundPoint } from '../../core/geometry.js';
import { DEFAULT_CX, DEFAULT_CY, DEFAULT_GRADIENT, DEFAULT_STROKE } from '../defaultProps.js';
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
    getOperators(id, resizeConfig, rotateConfig, 
    // boundingRect: BoundingRect,
    elementOrigin) {
        const boundingRect = this.getBoundingRect();
        const { x: cx, y: cy, width, height } = boundingRect;
        const { rotation } = this;
        return HANDLER_OFFSETS.map((OFFSET, index) => {
            // Calculate the handle position in local coordinates
            const currentCenterX = cx - width / 2 + OFFSET.x * width;
            const currentCenterY = cy - height / 2 + OFFSET.y * height;
            const handleElementProps = {
                id: `${id}-${OFFSET.type}-${index}`,
                layer: 0,
                rotation,
            };
            // let cursor: ResizeCursor = OFFSET.cursor as ResizeCursor
            if (OFFSET.type === 'resize') {
                const rotated = rotatePointAroundPoint(currentCenterX, currentCenterY, cx, cy, rotation);
                handleElementProps.cx = rotated.x;
                handleElementProps.cy = rotated.y;
                handleElementProps.width = resizeConfig.size;
                handleElementProps.height = resizeConfig.size;
                handleElementProps.stroke = {
                    ...DEFAULT_STROKE,
                    weight: resizeConfig.lineWidth,
                };
                // currentElementProps.stroke.weight = resizeConfig.stroke?.weight
                // currentElementProps.lineColor = resizeConfig.lineColor
                // currentElementProps.fillColor = resizeConfig.fillColor
            }
            else if (OFFSET.type === 'rotate') {
                const currentRotateHandlerCX = currentCenterX + OFFSET.offsetX * resizeConfig.lineWidth;
                const currentRotateHandlerCY = currentCenterY + OFFSET.offsetY * resizeConfig.lineWidth;
                const rotated = rotatePointAroundPoint(currentRotateHandlerCX, currentRotateHandlerCY, cx, cy, rotation);
                // handleElementProps.id = index + '-rotate'
                handleElementProps.cx = rotated.x;
                handleElementProps.cy = rotated.y;
                handleElementProps.width = rotateConfig.size;
                handleElementProps.height = rotateConfig.size;
                handleElementProps.lineWidth = rotateConfig.lineWidth;
                handleElementProps.lineColor = rotateConfig.lineColor;
                handleElementProps.fillColor = rotateConfig.fillColor;
            }
            return {
                id: `${id}`,
                type: OFFSET.type,
                name: OFFSET.name,
                // cursor,
                elementOrigin,
                element: new ElementRectangle(handleElementProps),
            };
        });
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
