"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSymmetricDifference = exports.areSetsEqual = exports.drawCrossLine = void 0;
exports.screenToWorld = screenToWorld;
exports.worldToScreen = worldToScreen;
exports.rotatePoint = rotatePoint;
exports.getResizeTransform = getResizeTransform;
/** Convert screen (mouse) coordinates to canvas coordinates */
function screenToWorld(point, offset, scale, dpr) {
    return {
        x: (point.x * dpr - offset.x) / scale,
        y: (point.y * dpr - offset.y) / scale,
    };
}
/** Convert canvas coordinates to screen coordinates */
function worldToScreen(point, offset, scale, dpr) {
    /*
    *
    x: canvasX * scale + offsetX,
    y: canvasY * scale + offsetY,
    * */
    return {
        x: ((point.x * scale) + offset.x) / dpr,
        y: ((point.y * scale) + offset.y) / dpr,
    };
}
const drawCrossLine = ({ ctx, mousePoint, scale, dpr, offset, virtualRect: { left: minX, top: minY, right: maxX, bottom: maxY }, }) => {
    const textOffsetX = 10 / (dpr * scale);
    const textOffsetY = 10 / (dpr * scale);
    const { x, y } = screenToWorld(mousePoint, offset, scale, dpr);
    const crossLineColor = '#ff0000';
    const textColor = '#ff0000';
    const textShadowColor = '#000';
    ctx.save();
    ctx.textBaseline = 'alphabetic';
    ctx.font = `${24 / scale}px sans-serif`;
    // ctx.setLineDash([3 * dpr * scale, 5 * dpr * scale])
    ctx.fillStyle = textColor;
    ctx.shadowColor = crossLineColor;
    ctx.shadowBlur = 1;
    ctx.fillText(`${Math.floor(x)}, ${Math.floor(y)}`, x + textOffsetX, y - textOffsetY, 200 / scale);
    ctx.lineWidth = 2 / (dpr * scale);
    ctx.strokeStyle = crossLineColor;
    ctx.shadowColor = textShadowColor;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(minX, y);
    ctx.lineTo(maxX, y);
    ctx.moveTo(x, minY);
    ctx.lineTo(x, maxY);
    ctx.stroke();
    ctx.restore();
};
exports.drawCrossLine = drawCrossLine;
const areSetsEqual = (setA, setB) => {
    if (setA.size !== setB.size)
        return false;
    for (const item of setA) {
        if (!setB.has(item))
            return false;
    }
    return true;
};
exports.areSetsEqual = areSetsEqual;
const getSymmetricDifference = (setA, setB) => {
    const result = new Set();
    for (const item of setA) {
        if (!setB.has(item))
            result.add(item);
    }
    for (const item of setB) {
        if (!setA.has(item))
            result.add(item);
    }
    return result;
};
exports.getSymmetricDifference = getSymmetricDifference;
function rotatePoint(px, py, cx, cy, rotation) {
    const dx = px - cx;
    const dy = py - cy;
    const angle = rotation * (Math.PI / 180);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: cx + dx * cos - dy * sin,
        y: cy + dx * sin + dy * cos,
    };
}
function getResizeTransform(name, symmetric = false) {
    const base = (() => {
        switch (name) {
            case 'tl':
                return { dx: -1, dy: -1, cx: 0.5, cy: 0.5 };
            case 't':
                return { dx: 0, dy: -1, cx: 0.0, cy: 0.5 };
            case 'tr':
                return { dx: 1, dy: -1, cx: -0.5, cy: 0.5 };
            case 'r':
                return { dx: 1, dy: 0, cx: -0.5, cy: 0.0 };
            case 'br':
                return { dx: 1, dy: 1, cx: -0.5, cy: -0.5 };
            case 'b':
                return { dx: 0, dy: 1, cx: 0.0, cy: -0.5 };
            case 'bl':
                return { dx: -1, dy: 1, cx: 0.5, cy: -0.5 };
            case 'l':
                return { dx: -1, dy: 0, cx: 0.5, cy: 0.0 };
            default:
                throw new Error(`Unsupported resize handle: ${name}`);
        }
    })();
    if (symmetric) {
        // When resizing symmetrically, center should not move.
        return Object.assign(Object.assign({}, base), { cx: 0, cy: 0 });
    }
    return base;
}
