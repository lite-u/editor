import ElementShape from '../shape/shape.js';
import { generateBoundingRectFromRect, generateBoundingRectFromRotatedRect } from '../../core/utils.js';
import transform from './transform.js';
import ElementRectangle from './rectangle.js';
import { DEFAULT_BORDER_RADIUS, DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../defaultProps.js';
import { isEqual } from '../../lib/lib.js';
class RectangleLike extends ElementShape {
    id;
    layer;
    width;
    height;
    borderRadius;
    // path2D: Path2D = new Path2D()
    original;
    constructor({ id, layer, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, borderRadius = DEFAULT_BORDER_RADIUS, ...rest }) {
        super(rest);
        this.id = id;
        this.layer = layer;
        this.width = width;
        this.height = height;
        this.borderRadius = borderRadius;
        this.original = {
            cx: this.cx,
            cy: this.cy,
            width,
            height,
            rotation: this.rotation,
        };
        this.updatePath2D();
    }
    updatePath2D() {
        const { cx, cy, width, height, borderRadius } = this;
        const w = width / 2;
        const h = height / 2;
        this.path2D = new Path2D();
        if (borderRadius.every(r => r > 0)) {
            this.path2D.moveTo(cx - w + borderRadius[0], cy - h);
            this.path2D.arcTo(cx + w, cy - h, cx + w, cy + h, borderRadius[1]);
            this.path2D.arcTo(cx + w, cy + h, cx - w, cy + h, borderRadius[2]);
            this.path2D.arcTo(cx - w, cy + h, cx - w, cy - h, borderRadius[3]);
            this.path2D.arcTo(cx - w, cy - h, cx + w, cy - h, borderRadius[0]);
        }
        else {
            this.path2D.rect(cx - w, cy - h, width, height);
        }
    }
    get getPoints() {
        const w = this.width / 2;
        const h = this.height / 2;
        return [
            { x: this.cx - w, y: this.cy - h }, // top-left
            { x: this.cx + w, y: this.cy - h }, // top-right
            { x: this.cx + w, y: this.cy + h }, // bottom-right
            { x: this.cx - w, y: this.cy + h }, // bottom-left
        ];
    }
    get corners() {
        const w = this.width / 2;
        const h = this.height / 2;
        return [
            { x: this.cx - w, y: this.cy - h }, // top-left
            { x: this.cx + w, y: this.cy - h }, // top-right
            { x: this.cx + w, y: this.cy + h }, // bottom-right
            { x: this.cx - w, y: this.cy + h }, // bottom-left
        ];
    }
    /*
      applyMatrix(matrix: DOMMatrix) {
        const points = this.corners.map(p => {
          const r = matrix.transformPoint(p)
          return {x: r.x, y: r.y}
        })
  
        // Recalculate x, y, width, height from transformed corners
        const xs = points.map(p => p.x)
        const ys = points.map(p => p.y)
        this.x = Math.min(...xs)
        this.y = Math.min(...ys)
        this.width = Math.max(...xs) - this.x
        this.height = Math.max(...ys) - this.y
      }
    */
    /*  rotate(angle: number, center?: Point) {
        this.rotation = angle
      }*/
    scale(sx, sy) {
        this.width *= sx;
        this.height *= sy;
    }
    scaleFrom(scaleX, scaleY, anchor) {
        // console.log(scaleX, scaleY, anchor)
        const matrix = new DOMMatrix()
            .translate(anchor.x, anchor.y)
            .scale(scaleX, scaleY)
            .translate(-anchor.x, -anchor.y);
        const { cx, cy, width, height } = this.original;
        const topLeft = this.transformPoint(cx - width / 2, cy - height / 2, matrix);
        const bottomRight = this.transformPoint(cx + width / 2, cy + height / 2, matrix);
        this.cx = (topLeft.x + bottomRight.x) / 2;
        this.cy = (topLeft.y + bottomRight.y) / 2;
        this.width = Math.abs(bottomRight.x - topLeft.x);
        this.height = Math.abs(bottomRight.y - topLeft.y);
        this.updatePath2D();
        // console.log(this.cx, this.cy, this.width, this.height)
    }
    /*  getTransformedPoints(): Point[] {
        // const {cx, cy, width, height} = this.original
        const corners: Point[] = this.corners
        return transformPoints(corners, this.matrix)
      }*/
    static applyResizeTransform = (arg) => {
        return transform(arg);
    };
    hitTest(point, borderPadding = 5) {
        console.log(9);
        // this.path2D.
    }
    hitTest1(point, borderPadding = 5) {
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
        const { borderRadius, width, height, id, layer, } = this;
        if (!borderRadius) {
            debugger;
        }
        return {
            ...super.toJSON(),
            id,
            layer,
            borderRadius: [...borderRadius],
            width,
            height,
        };
    }
    toMinimalJSON() {
        const result = {
            ...super.toMinimalJSON(),
            id: this.id,
            layer: this.layer,
        };
        if (!isEqual(this.borderRadius, DEFAULT_BORDER_RADIUS)) {
            result.borderRadius = [...this.borderRadius];
        }
        if (this.width !== DEFAULT_WIDTH) {
            result.width = this.width;
        }
        if (this.height !== DEFAULT_HEIGHT) {
            result.height = this.height;
        }
        return result;
    }
    getBoundingRect() {
        const { cx, cy, width, height, rotation } = this;
        const x = cx - width / 2;
        const y = cy - height / 2;
        if (rotation === 0) {
            return generateBoundingRectFromRect({ x, y, width, height });
        }
        return generateBoundingRectFromRotatedRect({ x, y, width, height }, rotation);
    }
    getBoundingRectFromOriginal() {
        const { cx, cy, width, height, rotation } = this.original;
        const x = cx - width / 2;
        const y = cy - height / 2;
        if (rotation === 0) {
            return generateBoundingRectFromRect({ x, y, width, height });
        }
        return generateBoundingRectFromRotatedRect({ x, y, width, height }, rotation);
    }
    getSelectedBoxElement(lineWidth, lineColor) {
        return new ElementRectangle({
            ...this.toJSON(),
            lineColor,
            lineWidth,
            id: this.id + '-selected-box',
            opacity: 0,
        });
    }
    getHighlightElement(lineWidth, lineColor) {
        return new ElementRectangle({
            ...this.toJSON(),
            lineColor,
            lineWidth,
            id: this.id + 'highlight',
            opacity: 0,
        });
    }
    getOperators(id, resizeConfig, rotateConfig) {
        return super.getOperators(id, resizeConfig, rotateConfig, this.getBoundingRect(), this.toJSON());
    }
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
}
export default RectangleLike;
