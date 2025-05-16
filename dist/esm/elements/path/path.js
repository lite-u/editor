import ElementBase from '../base/elementBase.js';
import { HANDLER_OFFSETS } from '../handleBasics.js';
import ElementRectangle from '../rectangle/rectangle.js';
import { rotatePointAroundPoint } from '../../core/geometry.js';
import { BasePath } from '../basePath/basePath.js';
import deepClone from '../../core/deepClone.js';
class ElementPath extends ElementBase {
    id;
    layer;
    type = 'path';
    points = [];
    constructor({ id, layer, points = [], ...rest }) {
        super(rest);
        this.points = deepClone(points);
        this.id = id;
        this.layer = layer;
    }
    toJSON() {
        return {
            ...super.toJSON(),
        };
    }
    toMinimalJSON() {
        const result = {
            ...super.toMinimalJSON(),
        };
        return result;
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
                currentElementProps.lineWidth = resizeConfig.lineWidth;
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
export default BasePath;
