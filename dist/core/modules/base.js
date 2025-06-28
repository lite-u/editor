"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Base {
    constructor({ id, lineColor, lineWidth = 1, opacity = 100, type, layer = 1, rotation = 0, shadow = false, enableLine = true, }) {
        this.id = id;
        this.layer = layer;
        this.enableLine = enableLine;
        this.lineColor = lineColor;
        this.lineWidth = lineWidth;
        this.opacity = opacity;
        this.rotation = rotation;
        this.shadow = shadow;
        this.type = type;
    }
    getDetails(includeIdentifiers = true) {
        const base = {
            type: this.type,
            enableLine: this.enableLine,
            lineColor: this.lineColor,
            lineWidth: this.lineWidth,
            opacity: this.opacity,
            shadow: this.shadow,
            rotation: this.rotation,
        };
        if (includeIdentifiers) {
            return Object.assign(Object.assign({}, base), { id: this.id, layer: this.layer });
        }
        return base;
    }
    getBoundingRect() {
        return { bottom: 0, cx: 0, cy: 0, left: 0, right: 0, top: 0, x: 0, y: 0, width: 0, height: 0 };
    }
    render(_ctx) {
        return undefined;
    }
    static applyRotating(shiftKey) {
        const { mouseDownPoint, mouseMovePoint, scale, dpr, offset } = this.viewport;
        const { module: { rotation }, moduleOrigin } = this._rotatingOperator;
        const { x, y } = moduleOrigin;
        const downX = (mouseDownPoint.x - offset.x / dpr) / scale * dpr;
        const downY = (mouseDownPoint.y - offset.y / dpr) / scale * dpr;
        const moveX = (mouseMovePoint.x - offset.x / dpr) / scale * dpr;
        const moveY = (mouseMovePoint.y - offset.y / dpr) / scale * dpr;
        const startAngle = Math.atan2(downY - y, downX - x);
        const currentAngle = Math.atan2(moveY - y, moveX - x);
        let rotationDelta = (currentAngle - startAngle) * (180 / Math.PI);
        if (shiftKey) {
            rotationDelta = Math.round(rotationDelta / 15) * 15;
        }
        let newRotation = (rotation + rotationDelta) % 360;
        if (newRotation < 0)
            newRotation += 360;
        return newRotation;
    }
}
exports.default = Base;
