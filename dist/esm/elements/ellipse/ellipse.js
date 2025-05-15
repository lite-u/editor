import { generateBoundingRectFromRotatedRect } from '../../core/utils.js';
import ElementShape from '../shape/shape.js';
import ElementRectangle from '../rectangle/rectangle.js';
import render from './render.js';
import transform from './transform.js';
class ElementEllipse extends ElementShape {
    type = 'ellipse';
    id;
    layer;
    // horizontal
    r1;
    // vertical
    r2;
    original;
    constructor({ r1, r2, id, layer, ...rest }) {
        super(rest);
        this.id = id;
        this.layer = layer;
        this.r1 = r1;
        this.r2 = r2;
        this.original = {
            cx: this.cx,
            cy: this.cy,
            r1: this.r1,
            r2: this.r1,
            rotation: this.rotation,
        };
    }
    scale(sx, sy) {
        this.r1 *= sx;
        this.r2 *= sy;
    }
    scaleFrom(scaleX, scaleY, anchor) {
        const matrix = new DOMMatrix()
            .translate(anchor.x, anchor.y)
            .scale(scaleX, scaleY)
            .translate(-anchor.x, -anchor.y);
        const { cx, cy, r1, r2 } = this.original;
        const center = this.transformPoint(cx, cy, matrix);
        const rx = this.transformPoint(cx + r1, cy, matrix);
        const ry = this.transformPoint(cx, cy + r2, matrix);
        this.cx = center.x;
        this.cy = center.y;
        this.r1 = Math.abs(rx.x - center.x);
        this.r2 = Math.abs(ry.y - center.y);
    }
    static applyResizeTransform = (props) => {
        return transform(props);
    };
    hitTest(point, borderPadding = 5) {
        const { cx: cx, cy: cy, r1, r2, rotation = 0 } = this;
        const cos = Math.cos(-rotation);
        const sin = Math.sin(-rotation);
        const dx = point.x - cx;
        const dy = point.y - cy;
        const localX = dx * cos - dy * sin;
        const localY = dx * sin + dy * cos;
        // Ellipse equation: (x^2 / a^2) + (y^2 / b^2)
        const norm = (localX * localX) / (r1 * r1) + (localY * localY) / (r2 * r2);
        const borderRange = borderPadding / Math.min(r1, r2); // normalized padding
        if (norm <= 1 + borderRange) {
            if (norm >= 1 - borderRange) {
                return 'border';
            }
            return 'inside';
        }
        return null;
    }
    toMinimalJSON() {
        return {
            ...super.toMinimalJSON(),
            id: this.id,
            type: this.type,
            layer: this.layer,
            r1: this.r1,
            r2: this.r2,
        };
    }
    toJSON() {
        return {
            ...super.toJSON(),
            id: this.id,
            type: this.type,
            layer: this.layer,
            r1: this.r1,
            r2: this.r2,
        };
    }
    getBoundingRect() {
        const { cx: cx, cy: cy, r1, r2, rotation } = this;
        return generateBoundingRectFromRotatedRect({
            x: cx - r1,
            y: cy - r2,
            width: r1 * 2,
            height: r2 * 2,
        }, rotation);
    }
    getBoundingRectFromOriginal() {
        const { cx: cx, cy: cy, r1, r2, rotation } = this.original;
        return generateBoundingRectFromRotatedRect({
            x: cx - r1,
            y: cy - r2,
            width: r1 * 2,
            height: r2 * 2,
        }, rotation);
    }
    getSelectedBoxElement(lineWidth, lineColor) {
        // const {id, rotation, layer} = this.toJSON()
        const rect = this.getBoundingRect();
        const rectProp = {
            cx: rect.cx,
            cy: rect.cy,
            width: rect.width,
            height: rect.height,
            lineColor,
            lineWidth,
            rotation: this.rotation,
            layer: this.layer,
            id: this.id + '-selected-box',
            opacity: 0,
        };
        return new ElementRectangle(rectProp);
    }
    getHighlightElement(lineWidth, lineColor) {
        const { cx, cy, r1, r2, rotation, layer, id } = this;
        return new ElementEllipse({
            cx: cx,
            cy: cy,
            r1,
            r2,
            lineColor,
            lineWidth,
            rotation,
            layer,
            id: id + 'highlight',
            opacity: 0,
        });
    }
    getOperators(id, resizeConfig, rotateConfig) {
        return super.getOperators(id, resizeConfig, rotateConfig, this.getBoundingRect(), this.toMinimalJSON());
    }
    /*
      public getSnapPoints(): SnapPointData[] {
        const {cx: cx, cy: cy, r1, r2} = this
  
        // Define snap points: center, cardinal edge points (top, right, bottom, left)
        const points: SnapPointData[] = [
          {id, x: cx, y: cy, type: 'center'},
          {id, x: cx, y: cy - r2, type: 'edge-top'},
          {id, x: cx + r1, y: cy, type: 'edge-right'},
          {id, x: cx, y: cy + r2, type: 'edge-bottom'},
          {id, x: cx - r1, y: cy, type: 'edge-left'},
        ]
  
        return points
      }*/
    render(ctx) {
        render.call(this, ctx);
    }
}
export default ElementEllipse;
