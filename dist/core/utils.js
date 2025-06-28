"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFloatOnProps = exports.isNegativeZero = exports.isInsideRotatedRect = exports.generateBoundingRectFromTwoPoints = exports.generateBoundingRectFromRect = exports.generateBoundingRectFromRotatedRect = void 0;
exports.rectsOverlap = rectsOverlap;
exports.throttle = throttle;
const generateBoundingRectFromRotatedRect = ({ x, y, width, height }, rotation) => {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rotatedWidth = Math.abs(width * cos) + Math.abs(height * sin);
    const rotatedHeight = Math.abs(width * sin) + Math.abs(height * cos);
    const rectX = centerX - rotatedWidth / 2;
    const rectY = centerY - rotatedHeight / 2;
    return (0, exports.generateBoundingRectFromRect)({
        x: rectX,
        y: rectY,
        width: rotatedWidth,
        height: rotatedHeight,
    });
};
exports.generateBoundingRectFromRotatedRect = generateBoundingRectFromRotatedRect;
const generateBoundingRectFromRect = (rect) => {
    const { x, y, width, height } = rect;
    return {
        x,
        y,
        width,
        height,
        top: y,
        bottom: y + height,
        left: x,
        right: x + width,
        cx: x + width / 2,
        cy: y + height / 2,
    };
};
exports.generateBoundingRectFromRect = generateBoundingRectFromRect;
const generateBoundingRectFromTwoPoints = (p1, p2) => {
    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);
    return (0, exports.generateBoundingRectFromRect)({
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    });
};
exports.generateBoundingRectFromTwoPoints = generateBoundingRectFromTwoPoints;
function rectsOverlap(r1, r2) {
    return !(r1.right < r2.left ||
        r1.left > r2.right ||
        r1.bottom < r2.top ||
        r1.top > r2.bottom);
}
/*export function rectInside(inner: BoundingRect, outer: BoundingRect): boolean {
  return (
    inner.left >= outer.left &&
    inner.right <= outer.right &&
    inner.top >= outer.top &&
    inner.bottom <= outer.bottom
  )
}*/
const isInsideRotatedRect = ({ x: mouseX, y: mouseY }, rect, rotation) => {
    const { x: centerX, y: centerY, width, height, } = rect;
    if (width <= 0 || height <= 0) {
        return false; // Invalid rectangle dimensions
    }
    // If the rotation is 0, no need to apply any rotation logic
    if (rotation === 0) {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        return (mouseX >= centerX - halfWidth && mouseX <= centerX + halfWidth &&
            mouseY >= centerY - halfHeight && mouseY <= centerY + halfHeight);
    }
    // Convert rotation angle from degrees to radians
    const angle = rotation * (Math.PI / 180);
    // Pre-calculate sine and cosine of the rotation angle for optimization
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    // Step 1: Translate the mouse position to the local space of the rotated rectangle
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    // Step 2: Undo the rotation by rotating the mouse position back
    const unrotatedX = dx * cosAngle + dy * sinAngle;
    const unrotatedY = -dx * sinAngle + dy * cosAngle;
    // Step 3: Check if the unrotated mouse position lies within the bounds of the axis-aligned rectangle
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    return (unrotatedX >= -halfWidth && unrotatedX <= halfWidth &&
        unrotatedY >= -halfHeight && unrotatedY <= halfHeight);
};
exports.isInsideRotatedRect = isInsideRotatedRect;
const isNegativeZero = (x) => x === 0 && (1 / x) === -Infinity;
exports.isNegativeZero = isNegativeZero;
function throttle(func, delay) {
    let lastCall = 0;
    let timeoutId;
    return (...args) => {
        const now = Date.now();
        const invoke = () => {
            lastCall = now;
            func(...args);
        };
        if (now - lastCall >= delay) {
            invoke();
        }
        else {
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(invoke, delay - (now - lastCall));
        }
    };
}
const setFloatOnProps = (obj, keys) => {
    keys.forEach((key) => {
        obj[key] = Math.floor(obj[key]);
    });
};
exports.setFloatOnProps = setFloatOnProps;
