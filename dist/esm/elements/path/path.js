import deepClone from '../../core/deepClone.js';
import ElementShape from '../shape/shape.js';
class ElementPath extends ElementShape {
    // readonly id: UID
    // readonly layer: number
    type = 'path';
    points = [];
    // private cx: number
    // private cy: number
    closed;
    // private original: { cx: number, cy: number, points: BezierPoint[], closed: boolean, rotation: number }
    constructor({ points = [], closed = false, ...rest }) {
        super(rest);
        this.points = deepClone(points);
        this.closed = closed;
        this.original = {
            ...this.original,
            closed,
            points: deepClone(points),
            rotation: this.rotation,
        };
        this.updatePath2D();
    }
    static cubicBezier(t, p0, p1, p2, p3) {
        const mt = 1 - t;
        const mt2 = mt * mt;
        const t2 = t * t;
        return {
            x: mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x,
            y: mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y,
        };
    }
    updateOriginal() {
        this.original.cx = deepClone(this.cx);
        this.original.cy = deepClone(this.cy);
        this.original.points = deepClone(this.points);
        this.original.closed = this.closed;
        this.original.rotation = this.rotation;
        this.updatePath2D();
    }
    get center() {
        return {
            x: this.cx,
            y: this.cy,
        };
    }
    get getPoints() {
        return this.points.map(p => ({ ...p.anchor }));
    }
    updatePath2D() {
        this.path2D = new Path2D();
        if (this.points.length === 0)
            return;
        const { cx, cy } = this;
        const transform = new DOMMatrix()
            .translate(cx, cy)
            .rotate(this.rotation)
            .translate(-cx, -cy);
        const startAnchor = this.points[0].anchor;
        const start = this.transformPoint(startAnchor.x + cx, startAnchor.y + cy, transform);
        this.path2D.moveTo(start.x, start.y);
        for (let i = 1; i < this.points.length; i++) {
            const prev = this.points[i - 1];
            const curr = this.points[i];
            const cp1 = prev.cp2
                ? this.transformPoint(prev.cp2.x + cx, prev.cp2.y + cy, transform)
                : this.transformPoint(prev.anchor.x + cx, prev.anchor.y + cy, transform);
            const cp2 = curr.cp1
                ? this.transformPoint(curr.cp1.x + cx, curr.cp1.y + cy, transform)
                : this.transformPoint(curr.anchor.x + cx, curr.anchor.y + cy, transform);
            const anchor = this.transformPoint(curr.anchor.x + cx, curr.anchor.y + cy, transform);
            this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, anchor.x, anchor.y);
        }
        if (this.closed && this.points.length > 1) {
            const last = this.points[this.points.length - 1];
            const first = this.points[0];
            const cp1 = last.cp2
                ? this.transformPoint(last.cp2.x + cx, last.cp2.y + cy, transform)
                : this.transformPoint(last.anchor.x + cx, last.anchor.y + cy, transform);
            const cp2 = first.cp1
                ? this.transformPoint(first.cp1.x + cx, first.cp1.y + cy, transform)
                : this.transformPoint(first.anchor.x + cx, first.anchor.y + cy, transform);
            const anchor = this.transformPoint(first.anchor.x + cx, first.anchor.y + cy, transform);
            this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, anchor.x, anchor.y);
            this.path2D.closePath();
        }
    }
    /* rotateFrom(rotation: number, anchor: Point, f: boolean): HistoryChangeItem | undefined {
       if (rotation !== 0) {
         const rect = this.getBoundingRectFromOriginal()
         const isSelfCenter = rect.cx.toFixed(2) === anchor.x.toFixed(2) && rect.cy.toFixed(2) === anchor.y.toFixed(2)
         console.log(isSelfCenter)
  
         if (isSelfCenter) {
           let newRotation = (this.original.rotation + rotation) % 360
           if (newRotation < 0) newRotation += 360
           this.rotation = newRotation
           console.log(this.rotation)
         } else {
           console.log(999)
           const matrix = new DOMMatrix()
             .translate(anchor.x, anchor.y)
             .rotate(rotation - this.rotation)
             .translate(-anchor.x, -anchor.y)
  
           this.points = this.original.points.map(p => {
             const anchorPt = this.transformPoint(p.anchor.x + this.cx, p.anchor.y + this.cy, matrix)
             const cp1 = p.cp1 ? this.transformPoint(p.cp1.x + this.cx, p.cp1.y + this.cy, matrix) : undefined
             const cp2 = p.cp2 ? this.transformPoint(p.cp2.x + this.cx, p.cp2.y + this.cy, matrix) : undefined
             return {
               anchor: { x: anchorPt.x - this.cx, y: anchorPt.y - this.cy },
               cp1: cp1 ? { x: cp1.x - this.cx, y: cp1.y - this.cy } : undefined,
               cp2: cp2 ? { x: cp2.x - this.cx, y: cp2.y - this.cy } : undefined,
             }
           })
  
           this.rotation = 0
         }
  
         this.updatePath2D()
       }
  
       if (f) {
         return {
           id: this.id,
           from: {
             points: deepClone(this.original.points),
             rotation: this.original.rotation,
           },
           to: {
             rotation: this.rotation,
             points: deepClone(this.points),
           },
         }
       }
     }
   */
    scaleFrom(scaleX, scaleY, anchor) {
        /*// console.log(scaleX, scaleY, anchor)
        const matrix = new DOMMatrix()
          .translate(anchor.x, anchor.y)
          .scale(scaleX, scaleY)
          .translate(-anchor.x, -anchor.y)
    
        const {cx, cy, width, height} = this.original
        const topLeft = this.transformPoint(cx - width / 2, cy - height / 2, matrix)
        const bottomRight = this.transformPoint(cx + width / 2, cy + height / 2, matrix)
    
        this.cx = (topLeft.x + bottomRight.x) / 2
        this.cy = (topLeft.y + bottomRight.y) / 2
        this.width = Math.abs(bottomRight.x - topLeft.x)
        this.height = Math.abs(bottomRight.y - topLeft.y)
    
        this.updatePath2D()*/
        // console.log(this.cx, this.cy, this.width, this.height)
    }
    static _getBoundingRect(points) {
        const samplePoints = [];
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const p0 = prev.anchor;
            const p1 = prev.cp2 ?? prev.anchor;
            const p2 = curr.cp1 ?? curr.anchor;
            const p3 = curr.anchor;
            for (let t = 0; t <= 1; t += 0.05) {
                samplePoints.push(ElementPath.cubicBezier(t, p0, p1, p2, p3));
            }
        }
        if (points.length === 1) {
            samplePoints.push(points[0].anchor);
        }
        const xs = samplePoints.map(p => p.x);
        const ys = samplePoints.map(p => p.y);
        const left = Math.min(...xs);
        const right = Math.max(...xs);
        const top = Math.min(...ys);
        const bottom = Math.max(...ys);
        const width = right - left;
        const height = bottom - top;
        const x = left;
        const y = top;
        const cx = x + width / 2;
        const cy = y + height / 2;
        return { x, y, width, height, left, right, top, bottom, cx, cy };
    }
    getBoundingRectFromOriginal() {
        const { cx, cy, rotation, points } = this.original;
        if (!points)
            return [];
        const matrix = new DOMMatrix()
            .translate(cx, cy)
            .rotate(rotation)
            .translate(-cx, -cy);
        const absolutePoints = points.map(p => ({
            anchor: this.transformPoint(p.anchor.x + cx, p.anchor.y + cy, matrix),
            cp1: p.cp1 ? this.transformPoint(p.cp1.x + cx, p.cp1.y + cy, matrix) : undefined,
            cp2: p.cp2 ? this.transformPoint(p.cp2.x + cx, p.cp2.y + cy, matrix) : undefined,
        }));
        return ElementPath._getBoundingRect(absolutePoints);
    }
    getBoundingRect(withoutRotation = false) {
        const cx = this.original.cx;
        const cy = this.original.cy;
        if (this.original.points) {
            const points = this.original.points?.map(p => ({
                anchor: { x: p.anchor.x + cx, y: p.anchor.y + cy },
                cp1: p.cp1 ? { x: p.cp1.x + cx, y: p.cp1.y + cy } : undefined,
                cp2: p.cp2 ? { x: p.cp2.x + cx, y: p.cp2.y + cy } : undefined,
            }));
            return ElementPath._getBoundingRect(points);
        }
        else {
            return [];
        }
    }
    toJSON() {
        return {
            type: this.type,
            points: this.points,
            closed: this.closed,
            ...super.toJSON(),
        };
    }
    toMinimalJSON() {
        return {
            type: this.type,
            points: this.points,
            closed: this.closed,
            ...super.toMinimalJSON(),
        };
    }
}
export default ElementPath;
