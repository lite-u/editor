import { HANDLER_OFFSETS } from './handleBasics.js';
import ElementRectangle from './rectangle/rectangle.js';
import { rotatePointAroundPoint } from '../core/geometry.js';
import { DEFAULT_FILL, DEFAULT_STROKE } from './defaultProps.js';
export const generateHandles = (element, ratio) => {
    const elementData = element.toJSON();
    const { id, x: ox, y: oy, rotation } = elementData;
    const { width, height } = element.getBoundingRect();
    // const {rotation} = this
    const lineWidth = 1 / ratio;
    const resizeSize = 10 / ratio;
    const rotateSize = 15 / ratio;
    const lineColor = '#5491f8';
    const resizeConfig = {
        width: resizeSize,
        height: resizeSize,
        fill: { ...DEFAULT_FILL, color: '#ffffff', enabled: false },
        stroke: { ...DEFAULT_STROKE, weight: lineWidth, color: lineColor },
    };
    const rotateConfig = {
        r1: rotateSize,
        r2: rotateSize,
        fill: { ...DEFAULT_FILL, enabled: false },
        stroke: { ...DEFAULT_STROKE, enabled: false },
    };
    return HANDLER_OFFSETS.map((OFFSET, index) => {
        // Calculate the handle position in local coordinates
        const cx = ox - width / 2 + OFFSET.x * width;
        const cy = oy - height / 2 + OFFSET.y * height;
        const basicProps = {
            id: `${id}-${OFFSET.type}-${index}`,
            layer: 0,
            rotation,
        };
        if (OFFSET.type === 'resize') {
            const rotated = rotatePointAroundPoint(cx, cy, ox, oy, rotation);
            basicProps.cx = rotated.x;
            basicProps.cy = rotated.y;
            Object.assign(basicProps, resizeConfig);
        }
        else {
            const currentRotateHandlerCX = cx + OFFSET.offsetX * lineWidth;
            const currentRotateHandlerCY = cy + OFFSET.offsetY * lineWidth;
            const rotated = rotatePointAroundPoint(currentRotateHandlerCX, currentRotateHandlerCY, ox, oy, rotation);
            basicProps.cx = rotated.x;
            basicProps.cy = rotated.y;
            Object.assign(basicProps, rotateConfig);
        }
        return {
            id: `${id}`,
            type: OFFSET.type,
            name: OFFSET.name,
            // cursor,
            elementOrigin: elementData,
            element: new ElementRectangle(basicProps),
        };
    });
};
