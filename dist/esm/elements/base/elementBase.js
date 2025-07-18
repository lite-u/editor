import { generateBoundingRectFromTwoPoints } from '../../core/utils.js';
import { DEFAULT_CX, DEFAULT_CY, DEFAULT_FILL, DEFAULT_GRADIENT, DEFAULT_OPACITY, DEFAULT_ROTATION, DEFAULT_SHADOW, DEFAULT_STROKE, DEFAULT_TRANSFORM, } from '../defaultProps.js';
import deepClone from '../../core/deepClone.js';
import { isEqual } from '../../lib/lib.js';
class ElementBase {
    id;
    layer;
    cx;
    cy;
    gradient;
    stroke;
    fill;
    opacity;
    shadow;
    rotation;
    transform;
    show;
    path2D = new Path2D();
    boundingRect;
    originalBoundingRect;
    originalBoundingRectWithRotation;
    _shadowPath;
    _transforming = false;
    original;
    // public _relatedId: string
    eventListeners = {};
    onmouseenter;
    onmouseleave;
    onmousedown;
    onmousemove;
    onmouseup;
    constructor({ id, layer, cx = DEFAULT_CX, cy = DEFAULT_CY, gradient = DEFAULT_GRADIENT, stroke = deepClone(DEFAULT_STROKE), fill = deepClone(DEFAULT_FILL), opacity = DEFAULT_OPACITY, rotation = DEFAULT_ROTATION, shadow = deepClone(DEFAULT_SHADOW), transform = deepClone(DEFAULT_TRANSFORM), show = true, }) {
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
        const rect = generateBoundingRectFromTwoPoints({ x: 0, y: 0 }, { x: 0, y: 0 });
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
        /*    if(eventData.type ==='mouseenter'){
              debugger
            }*/
        eventData.type === 'mouseenter' && this.onmouseenter?.(eventData);
        eventData.type === 'mouseleave' && this.onmouseleave?.(eventData);
        eventData.type === 'mousedown' && this.onmousedown?.(eventData);
        eventData.type === 'mousemove' && this.onmousemove?.(eventData);
        eventData.type === 'mouseup' && this.onmouseup?.(eventData);
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
        this.cx = this.cx + dx;
        this.cy = this.cy + dy;
        this.updatePath2D();
        this.updateBoundingRect();
        this.eventListeners['move']?.forEach(handler => handler({ dx, dy }));
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
            gradient: deepClone(gradient),
            stroke: deepClone(stroke),
            fill: deepClone(fill),
            opacity: opacity,
            shadow: deepClone(shadow),
            rotation: rotation,
            transform: deepClone(transform),
        };
    }
    toMinimalJSON() {
        const result = { id: this.id, layer: this.layer };
        if (!this.show) {
            result.show = false;
        }
        if (this.cx !== DEFAULT_CX) {
            result.cx = this.cx;
        }
        if (this.cy !== DEFAULT_CY) {
            result.cy = this.cy;
        }
        if (!isEqual(this.gradient, DEFAULT_GRADIENT)) {
            result.gradient = deepClone(this.gradient);
        }
        if (!isEqual(this.stroke, DEFAULT_STROKE)) {
            result.stroke = deepClone(this.stroke);
        }
        if (!isEqual(this.fill, DEFAULT_FILL)) {
            result.fill = deepClone(this.fill);
        }
        if (!isEqual(this.opacity, DEFAULT_OPACITY)) {
            result.opacity = this.opacity;
        }
        if (!isEqual(this.shadow, DEFAULT_SHADOW)) {
            result.shadow = deepClone(this.shadow);
        }
        if (!isEqual(this.rotation, DEFAULT_ROTATION)) {
            result.rotation = this.rotation;
        }
        if (!isEqual(this.transform, DEFAULT_TRANSFORM)) {
            result.transform = deepClone(this.transform);
        }
        return result;
    }
    getBoundingRect() {
        return generateBoundingRectFromTwoPoints({ x: 0, y: 0 }, { x: 0, y: 0 });
    }
    // @ts-ignore
    getBoundingRectFromOriginal(withoutRotation = false) {
        return generateBoundingRectFromTwoPoints({ x: 0, y: 0 }, { x: 0, y: 0 });
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
export default ElementBase;
