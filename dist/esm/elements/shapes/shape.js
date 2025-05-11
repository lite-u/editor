import Base from '../base/base.js';
import { HANDLER_OFFSETS } from '../handleBasics.js';
import { rotatePoint } from '../../core/lib.js';
import Rectangle from './rectangle';
class Shape extends Base {
    x;
    y;
    fillColor;
    enableFill;
    constructor({ x, y, fillColor, enableFill = true, ...rest }) {
        super(rest);
        this.x = x;
        this.y = y;
        this.fillColor = fillColor;
        this.enableFill = enableFill;
    }
    getDetails(includeIdentifiers = true) {
        return {
            ...super.getDetails(includeIdentifiers),
            fillColor: this.fillColor,
            enableFill: this.enableFill,
            x: this.x,
            y: this.y,
        };
    }
    move(x, y) {
        this.x += x;
        this.y += y;
    }
    getOperators(resizeConfig, rotateConfig, boundingRect, moduleOrigin) {
        const { x: cx, y: cy, width, height } = boundingRect;
        // const id = this.id
        const { id, rotation } = this;
        const handlers = HANDLER_OFFSETS.map((OFFSET) => {
            // Calculate the handle position in local coordinates
            const currentCenterX = cx - width / 2 + OFFSET.x * width;
            const currentCenterY = cy - height / 2 + OFFSET.y * height;
            const currentModuleProps = {
                id,
                width: 0,
                height: 0,
                x: currentCenterX,
                y: currentCenterY,
                lineColor: '',
                lineWidth: 0,
                rotation,
                layer: this.layer,
                opacity: 100,
            };
            // let cursor: ResizeCursor = OFFSET.cursor as ResizeCursor
            if (OFFSET.type === 'resize') {
                const rotated = rotatePoint(currentCenterX, currentCenterY, cx, cy, rotation);
                // cursor = getCursor(rotated.x, rotated.y, cx, cy, rotation)
                currentModuleProps.id += 'resize';
                currentModuleProps.x = rotated.x;
                currentModuleProps.y = rotated.y;
                currentModuleProps.width = resizeConfig.size;
                currentModuleProps.height = resizeConfig.size;
                currentModuleProps.lineWidth = resizeConfig.lineWidth;
                currentModuleProps.lineColor = resizeConfig.lineColor;
                currentModuleProps.fillColor = resizeConfig.fillColor;
            }
            else if (OFFSET.type === 'rotate') {
                const currentRotateHandlerCenterX = currentCenterX + OFFSET.offsetX * resizeConfig.lineWidth;
                const currentRotateHandlerCenterY = currentCenterY + OFFSET.offsetY * resizeConfig.lineWidth;
                const rotated = rotatePoint(currentRotateHandlerCenterX, currentRotateHandlerCenterY, cx, cy, rotation);
                currentModuleProps.id += 'rotate';
                currentModuleProps.x = rotated.x;
                currentModuleProps.y = rotated.y;
                currentModuleProps.width = rotateConfig.size;
                currentModuleProps.height = rotateConfig.size;
                currentModuleProps.lineWidth = rotateConfig.lineWidth;
                currentModuleProps.lineColor = rotateConfig.lineColor;
                currentModuleProps.fillColor = rotateConfig.fillColor;
            }
            return {
                id: `${id}`,
                type: OFFSET.type,
                name: OFFSET.name,
                // cursor,
                moduleOrigin,
                module: new Rectangle(currentModuleProps),
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
