import { generateBoundingRectFromTwoPoints } from '~/core/utils';
import { DEFAULT_CX, DEFAULT_CY, DEFAULT_FILL, DEFAULT_GRADIENT, DEFAULT_OPACITY, DEFAULT_ROTATION, DEFAULT_SHADOW, DEFAULT_STROKE, DEFAULT_TRANSFORM, } from '~/elements/defaultProps';
import deepClone from '~/core/deepClone';
import { isEqual } from '~/lib/lib';
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
    // protected matrix = new DOMMatrix()
    path2D = new Path2D();
    original;
    // public _relatedId: string
    eventListeners = {};
    onmouseenter;
    onmouseleave;
    onmousedown;
    onmousemove;
    onmouseup;
    constructor({ id, layer, cx = DEFAULT_CX, cy = DEFAULT_CY, gradient = DEFAULT_GRADIENT, stroke = deepClone(DEFAULT_STROKE), fill = deepClone(DEFAULT_FILL), opacity = deepClone(DEFAULT_OPACITY), shadow = deepClone(DEFAULT_SHADOW), rotation = deepClone(DEFAULT_ROTATION), transform = deepClone(DEFAULT_TRANSFORM), show = true, }) {
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
    }
    static transformPoint(x, y, matrix) {
        // if(!matrix) debugger
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
    translate(dx, dy, f = false) {
        this.cx = this.cx + dx;
        this.cy = this.cy + dy;
        this.updatePath2D();
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
    rotate(angle) {
        this.rotation = angle;
        this.updatePath2D();
    }
    rotateFrom(rotation, anchor, f) {
        // if (rotation !== 0) {
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
    updatePath2D() { }
    restore(props) {
        Object.assign(this, props);
        Object.assign(this.original, props);
        this.updatePath2D();
    }
    getTransformedPoints() {
        return [];
    }
    getCenter() {
        return { x: 0, y: 0 };
    }
    clone() {
        console.log(this);
        const data = this.toJSON();
        return new this.constructor.prototype(data);
    }
    /*protected resetTransform() {
      this.matrix = new DOMMatrix()
    }*/
    /*  protected applyTransform(matrix: DOMMatrix): void {
        this.matrix = matrix.multiply(this.matrix)
      }*/
    /*  protected getTransformMatrix(): DOMMatrix {
        return this.matrix
      }*/
    render(ctx) {
        if (!this.path2D)
            return;
        let { show, opacity, fill, stroke } = this;
        const { enabled: enabledFill, color: fillColor } = fill;
        const { enabled: enabledStroke, color: strokeColor, weight /*join, cap*/ } = stroke;
        if (!show || opacity <= 0)
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
            // console.log(weight,strokeColor)
            ctx.strokeStyle = strokeColor;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.stroke(this.path2D);
        }
        ctx.restore();
    }
}
export default ElementBase;
