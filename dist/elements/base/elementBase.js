"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("~/core/utils");
const defaultProps_1 = require("~/elements/defaultProps");
const deepClone_1 = __importDefault(require("~/core/deepClone"));
const lib_1 = require("~/lib/lib");
class ElementBase {
    constructor({ id, layer, cx = defaultProps_1.DEFAULT_CX, cy = defaultProps_1.DEFAULT_CY, gradient = defaultProps_1.DEFAULT_GRADIENT, stroke = (0, deepClone_1.default)(defaultProps_1.DEFAULT_STROKE), fill = (0, deepClone_1.default)(defaultProps_1.DEFAULT_FILL), opacity = defaultProps_1.DEFAULT_OPACITY, rotation = defaultProps_1.DEFAULT_ROTATION, shadow = (0, deepClone_1.default)(defaultProps_1.DEFAULT_SHADOW), transform = (0, deepClone_1.default)(defaultProps_1.DEFAULT_TRANSFORM), show = true, }) {
        this.path2D = new Path2D();
        this._transforming = false;
        // public _relatedId: string
        this.eventListeners = {};
        this.id = id;
        this.layer = layer;
        this.cx = cx;
        this.cy = cy;
        this.stroke = stroke;
        this.fill = fill;
        this.opacity = opacity;
        this.shadow = shadow;
        this.rotation = rotation;
        this.transform = transform;
        this.show = show;
        this.gradient = gradient;
        this.original = {
            cx: this.cx,
            cy: this.cy,
            rotation: this.rotation,
        };
        const rect = (0, utils_1.generateBoundingRectFromTwoPoints)({ x: 0, y: 0 }, { x: 0, y: 0 });
        this.boundingRect = rect;
        this.originalBoundingRect = rect;
        this.originalBoundingRectWithRotation = rect;
    }
    static transformPoint(x, y, matrix) {
        const p = matrix.transformPoint({ x, y });
        return { x: p.x, y: p.y };
    }
    on(event, handler) {
        if (!this.eventListeners[event])
            this.eventListeners[event] = [];
        this.eventListeners[event].push(handler);
    }
    // dispatch
    dispatchEvent(eventData) {
        var _a, _b, _c, _d, _e;
        /*    if(eventData.type ==='mouseenter'){
              debugger
            }*/
        eventData.type === 'mouseenter' && ((_a = this.onmouseenter) === null || _a === void 0 ? void 0 : _a.call(this, eventData));
        eventData.type === 'mouseleave' && ((_b = this.onmouseleave) === null || _b === void 0 ? void 0 : _b.call(this, eventData));
        eventData.type === 'mousedown' && ((_c = this.onmousedown) === null || _c === void 0 ? void 0 : _c.call(this, eventData));
        eventData.type === 'mousemove' && ((_d = this.onmousemove) === null || _d === void 0 ? void 0 : _d.call(this, eventData));
        eventData.type === 'mouseup' && ((_e = this.onmouseup) === null || _e === void 0 ? void 0 : _e.call(this, eventData));
        const handlers = this.eventListeners[eventData.type];
        if (!handlers)
            return;
        for (const handler of handlers) {
            handler(eventData);
            if (eventData.isPropagationStopped)
                break;
        }
    }
    set transforming(v) {
        if (v) {
            if (!this._shadowPath) {
                this._shadowPath = this.toPath();
            }
        }
        else {
            this._shadowPath = null;
        }
        this._transforming = v;
    }
    translate(dx, dy, f = false) {
        var _a;
        this.cx = this.cx + dx;
        this.cy = this.cy + dy;
        this.updatePath2D();
        this.updateBoundingRect();
        (_a = this.eventListeners['move']) === null || _a === void 0 ? void 0 : _a.forEach(handler => handler({ dx, dy }));
        if (f) {
            return {
                id: this.id,
                from: {
                    cx: this.original.cx,
                    cy: this.original.cy,
                },
                to: {
                    cx: this.cx,
                    cy: this.cy,
                },
            };
        }
    }
    /* Invoke updateOriginal method when you do accept the element's current state as static state */
    updateOriginal() { }
    updateBoundingRect() {
        this.boundingRect = this.getBoundingRect();
    }
    updateOriginalBoundingRect() {
        this.originalBoundingRect = this.getBoundingRectFromOriginal();
        this.originalBoundingRectWithRotation = this.getBoundingRectFromOriginal(true);
    }
    /*  protected rotate(angle: number) {
        this.rotation = angle
        this.updatePath2D()
        this.updateBoundingRect()
  
        // this.updateTransform()
      }*/
    rotateFrom(rotation, anchor, f = false) {
        const matrix = new DOMMatrix()
            .translate(anchor.x, anchor.y)
            .rotate(rotation)
            .translate(-anchor.x, -anchor.y);
        const { cx, cy } = this.original;
        const transformed = matrix.transformPoint({ x: cx, y: cy });
        let newRotation = (this.original.rotation + rotation) % 360;
        if (newRotation < 0)
            newRotation += 360;
        this.rotation = newRotation;
        this.cx = transformed.x;
        this.cy = transformed.y;
        this.updatePath2D();
        this.updateBoundingRect();
        if (f) {
            return {
                id: this.id,
                from: {
                    cx: this.original.cx,
                    cy: this.original.cy,
                    rotation: this.original.rotation,
                },
                to: {
                    cx: this.cx,
                    cy: this.cy,
                    rotation: this.rotation,
                },
            };
        }
    }
    get center() {
        return { x: this.cx, y: this.cy };
    }
    toJSON() {
        const { id, cx, cy, rotation, layer, show, stroke, fill, opacity, shadow, gradient, transform, } = this;
        return {
            id,
            layer,
            show,
            cx,
            cy,
            gradient: (0, deepClone_1.default)(gradient),
            stroke: (0, deepClone_1.default)(stroke),
            fill: (0, deepClone_1.default)(fill),
            opacity: opacity,
            shadow: (0, deepClone_1.default)(shadow),
            rotation: rotation,
            transform: (0, deepClone_1.default)(transform),
        };
    }
    toMinimalJSON() {
        const result = { id: this.id, layer: this.layer };
        if (!this.show) {
            result.show = false;
        }
        if (this.cx !== defaultProps_1.DEFAULT_CX) {
            result.cx = this.cx;
        }
        if (this.cy !== defaultProps_1.DEFAULT_CY) {
            result.cy = this.cy;
        }
        if (!(0, lib_1.isEqual)(this.gradient, defaultProps_1.DEFAULT_GRADIENT)) {
            result.gradient = (0, deepClone_1.default)(this.gradient);
        }
        if (!(0, lib_1.isEqual)(this.stroke, defaultProps_1.DEFAULT_STROKE)) {
            result.stroke = (0, deepClone_1.default)(this.stroke);
        }
        if (!(0, lib_1.isEqual)(this.fill, defaultProps_1.DEFAULT_FILL)) {
            result.fill = (0, deepClone_1.default)(this.fill);
        }
        if (!(0, lib_1.isEqual)(this.opacity, defaultProps_1.DEFAULT_OPACITY)) {
            result.opacity = this.opacity;
        }
        if (!(0, lib_1.isEqual)(this.shadow, defaultProps_1.DEFAULT_SHADOW)) {
            result.shadow = (0, deepClone_1.default)(this.shadow);
        }
        if (!(0, lib_1.isEqual)(this.rotation, defaultProps_1.DEFAULT_ROTATION)) {
            result.rotation = this.rotation;
        }
        if (!(0, lib_1.isEqual)(this.transform, defaultProps_1.DEFAULT_TRANSFORM)) {
            result.transform = (0, deepClone_1.default)(this.transform);
        }
        return result;
    }
    getBoundingRect() {
        return (0, utils_1.generateBoundingRectFromTwoPoints)({ x: 0, y: 0 }, { x: 0, y: 0 });
    }
    // @ts-ignore
    getBoundingRectFromOriginal(withoutRotation = false) {
        return (0, utils_1.generateBoundingRectFromTwoPoints)({ x: 0, y: 0 }, { x: 0, y: 0 });
    }
    // @ts-ignore
    toPath() { }
    updateTransform() {
        const { cx, cy, width, height } = this.getBoundingRect();
        this.transform = {
            cx, cy, width, height,
            rotation: this.rotation,
        };
    }
    updatePath2D() { }
    restore(props) {
        Object.assign(this, props);
        Object.assign(this.original, props);
        this.updatePath2D();
        this.updateBoundingRect();
        this.updateOriginalBoundingRect();
    }
    getTransformedPoints() {
        return [];
    }
    getCenter() {
        return { x: 0, y: 0 };
    }
    clone() {
        if (this._transforming && this._shadowPath) {
            return this._shadowPath.clone();
        }
        const data = this.toJSON();
        const ctor = this.constructor;
        return new ctor(data);
    }
    render(ctx) {
        let { show, opacity, fill, stroke, path2D } = this;
        const { enabled: enabledFill, color: fillColor } = fill;
        const { enabled: enabledStroke, color: strokeColor, weight /*join, cap*/ } = stroke;
        if (!path2D || !show || opacity <= 0)
            return;
        ctx.save();
        if (opacity < 100) {
            ctx.globalAlpha = opacity / 100;
        }
        if (enabledFill) {
            ctx.fillStyle = fillColor;
            ctx.fill(this.path2D);
        }
        if (enabledStroke && weight > 0) {
            ctx.lineWidth = weight;
            ctx.strokeStyle = strokeColor;
            // ctx.lineJoin = 'round'
            ctx.lineCap = 'round';
            ctx.stroke(this.path2D);
        }
        ctx.restore();
    }
}
exports.default = ElementBase;
