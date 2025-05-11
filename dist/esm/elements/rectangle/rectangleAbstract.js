import Shape from '../shape/shape.js';
// import {getResizeTransform} from '../../core/lib.js'
import { generateBoundingRectFromRect, generateBoundingRectFromRotatedRect } from '../../core/utils.js';
import renderer from './renderer.js';
import transform from './transform.js';
const DEFAULT_WIDTH = 10;
const DEFAULT_HEIGHT = 10;
const DEFAULT_RADIUS = 0;
class RectangleLike extends Shape {
    type = 'rectangle';
    id;
    layer;
    width;
    height;
    radius;
    constructor({ id, layer, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, radius = DEFAULT_RADIUS, ...rest }) {
        super(rest);
        this.id = id;
        this.layer = layer;
        this.width = width;
        this.height = height;
        this.radius = radius;
    }
    static applyResizeTransform = (arg) => {
        return transform(arg);
    };
    hitTest(point, borderPadding = 5) {
        const { cx: cx, cy: cy, width, height, rotation = 0 } = this;
        const rad = rotation * (Math.PI / 180);
        const cos = Math.cos(-rad);
        const sin = Math.sin(-rad);
        const dx = point.x - cx;
        const dy = point.y - cy;
        // Rotate the point into the rectangle's local coordinate system
        const localX = dx * cos - dy * sin;
        const localY = dx * sin + dy * cos;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const withinX = localX >= -halfWidth && localX <= halfWidth;
        const withinY = localY >= -halfHeight && localY <= halfHeight;
        // console.log('hit')
        if (withinX && withinY) {
            const nearLeft = Math.abs(localX + halfWidth) <= borderPadding;
            const nearRight = Math.abs(localX - halfWidth) <= borderPadding;
            const nearTop = Math.abs(localY + halfHeight) <= borderPadding;
            const nearBottom = Math.abs(localY - halfHeight) <= borderPadding;
            if (nearLeft || nearRight || nearTop || nearBottom) {
                return 'border';
            }
            return 'inside';
        }
        return null;
    }
    toJSON() {
        const { radius, width, height, id, layer, } = this;
        return {
            ...super.toJSON(),
            type: this.type,
            id,
            layer,
            radius,
            width,
            height,
        };
    }
    toMinimalJSON() {
        const result = {
            ...super.toMinimalJSON(),
            type: 'rectangle',
            id: this.id,
            layer: this.layer,
        };
        if (this.radius !== DEFAULT_RADIUS) {
            result.radius = this.radius;
        }
        if (this.width !== DEFAULT_WIDTH) {
            result.width = this.width;
        }
        if (this.height !== DEFAULT_HEIGHT) {
            result.height = this.height;
        }
        return result;
    }
    getRect() {
        const { cx, cy, width, height } = this;
        return {
            cx,
            cy,
            width,
            height,
        };
    }
    getBoundingRect() {
        const { cx, cy, width, height, rotation } = this;
        const x = cx - width / 2;
        const y = cy - height / 2;
        if (rotation === 0) {
            return generateBoundingRectFromRect({ x, y, width, height });
            /*return {
              x,
              y,
              width,
              height,
              left: x,
              top: y,
              right: x + width,
              bottom: y + height,
              cx,
              cy,
            }*/
        }
        return generateBoundingRectFromRotatedRect({ x, y, width, height }, rotation);
    }
    getSelectedBoxModule(lineWidth, lineColor) {
        const { id, rotation, layer } = this;
        const rectProp = {
            ...this.getRect(),
            lineColor,
            lineWidth,
            rotation,
            layer,
            id: id + '-selected-box',
            opacity: 0,
        };
        return new Rectangle(rectProp);
    }
    getHighlightModule(lineWidth, lineColor) {
        const { cx, cy, width, height, rotation, layer, id } = this;
        return new Rectangle({
            cx: cx,
            cy: cy,
            width,
            height,
            // fillColor,
            lineColor,
            lineWidth,
            rotation,
            layer,
            id: id + 'highlight',
            opacity: 0,
        });
    }
    /*  public getOperators(
        id: string,
        resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
        rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
      ) {
  
        return super.getOperators(id, resizeConfig, rotateConfig, this.getRect(), this.toJSON())
      }*/
    getSnapPoints() {
        const { cx: cx, cy: cy, width, height, id } = this;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        // Define basic snap points: center, corners, and edge centers
        const points = [
            { id, x: cx, y: cy, type: 'center' },
            { id, x: cx - halfWidth, y: cy - halfHeight, type: 'corner-tl' },
            { id, x: cx + halfWidth, y: cy - halfHeight, type: 'corner-tr' },
            { id, x: cx + halfWidth, y: cy + halfHeight, type: 'corner-br' },
            { id, x: cx - halfWidth, y: cy + halfHeight, type: 'corner-bl' },
            { id, x: cx, y: cy - halfHeight, type: 'edge-top' },
            { id, x: cx + halfWidth, y: cy, type: 'edge-right' },
            { id, x: cx, y: cy + halfHeight, type: 'edge-bottom' },
            { id, x: cx - halfWidth, y: cy, type: 'edge-left' },
        ];
        return points;
    }
    render(ctx) {
        renderer(this, ctx);
    }
}
export default Rectangle;
