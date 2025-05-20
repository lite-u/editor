import { generateBoundingRectFromRotatedRect } from '../../core/utils.js';
import ElementShape from '../shape/shape.js';
import ElementRectangle from '../rectangle/rectangle.js';
import render from './render.js';
import { rotatePointAroundPoint } from '../../core/geometry.js';
class ElementEllipse extends ElementShape {
    type = 'ellipse';
    // horizontal
    r1;
    // vertical
    r2;
    constructor({ r1, r2, ...rest }) {
        super(rest);
        this.r1 = r1;
        this.r2 = r2;
        this.original = {
            ...this.original,
            r1: this.r1,
            r2: this.r1,
        };
        this.updatePath2D();
    }
    get getPoints() {
        const { cx, cy, r1, r2, rotation } = this;
        // Points before rotation
        const top = rotatePointAroundPoint(cx, cy - r2, cx, cy, rotation);
        const bottom = rotatePointAroundPoint(cx, cy + r2, cx, cy, rotation);
        const left = rotatePointAroundPoint(cx - r1, cy, cx, cy, rotation);
        const right = rotatePointAroundPoint(cx + r1, cy, cx, cy, rotation);
        return [top, right, bottom, left];
    }
    updatePath2D() {
        this.path2D = new Path2D();
        this.path2D.ellipse(this.cx, this.cy, this.r1, this.r2, this.rotation, 0, Math.PI * 2);
        this.path2D.closePath();
    }
    updateOriginal() {
        this.original.cx = this.cx;
        this.original.cy = this.cy;
        this.original.r1 = this.r1;
        this.original.r2 = this.r2;
        this.original.rotation = this.rotation;
        this.updatePath2D();
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
        this.updatePath2D();
    }
    toMinimalJSON() {
        return {
            ...super.toMinimalJSON(),
            type: this.type,
            r1: this.r1,
            r2: this.r2,
        };
    }
    toJSON() {
        return {
            ...super.toJSON(),
            type: this.type,
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
