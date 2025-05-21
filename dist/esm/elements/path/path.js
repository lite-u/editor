import ElementBase from '../base/elementBase.js';
import { HANDLER_OFFSETS } from '../handleBasics.js';
import ElementRectangle from '../rectangle/rectangle.js';
import { rotatePointAroundPoint } from '../../core/geometry.js';
import deepClone from '../../core/deepClone.js';
class ElementPath extends ElementBase {
    // readonly id: UID
    // readonly layer: number
    type = 'path';
    points = [];
    closed;
    original;
    constructor({ points = [], closed = false, ...rest }) {
        super(rest);
        this.points = deepClone(points);
        this.closed = closed;
        // console.log(this.points)
        this.original = {
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
        this.original.points = deepClone(this.points);
        this.original.closed = this.closed;
        this.updatePath2D();
    }
    get center() {
        const rect = this.getBoundingRect();
        return {
            x: rect.cx,
            y: rect.cy,
        };
    }
    get getPoints() {
        return this.points.map(p => ({ ...p.anchor }));
    }
    updatePath2D() {
        this.path2D = new Path2D();
        if (this.points.length === 0)
            return;
        const rect = this.getBoundingRect();
        const cx = rect.cx;
        const cy = rect.cy;
        const transform = new DOMMatrix()
            .translate(cx, cy)
            .rotate(this.rotation)
            .translate(-cx, -cy);
        const start = this.transformPoint(this.points[0].anchor.x, this.points[0].anchor.y, transform);
        this.path2D.moveTo(start.x, start.y);
        for (let i = 1; i < this.points.length; i++) {
            const prev = this.points[i - 1];
            const curr = this.points[i];
            const cp1 = prev.cp2 ? this.transformPoint(prev.cp2.x, prev.cp2.y, transform) : this.transformPoint(prev.anchor.x, prev.anchor.y, transform);
            const cp2 = curr.cp1 ? this.transformPoint(curr.cp1.x, curr.cp1.y, transform) : this.transformPoint(curr.anchor.x, curr.anchor.y, transform);
            const anchor = this.transformPoint(curr.anchor.x, curr.anchor.y, transform);
            this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, anchor.x, anchor.y);
        }
        if (this.closed && this.points.length > 1) {
            const last = this.points[this.points.length - 1];
            const first = this.points[0];
            const cp1 = last.cp2 ? this.transformPoint(last.cp2.x, last.cp2.y, transform) : this.transformPoint(last.anchor.x, last.anchor.y, transform);
            const cp2 = first.cp1 ? this.transformPoint(first.cp1.x, first.cp1.y, transform) : this.transformPoint(first.anchor.x, first.anchor.y, transform);
            const anchor = this.transformPoint(first.anchor.x, first.anchor.y, transform);
            this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, anchor.x, anchor.y);
            this.path2D.closePath();
        }
    }
    translate(dx, dy) {
        this.points.forEach(p => {
            p.anchor.x += dx;
            p.anchor.y += dy;
            if (p.cp1) {
                p.cp1.x += dx;
                p.cp1.y += dy;
            }
            if (p.cp2) {
                p.cp2.x += dx;
                p.cp2.y += dy;
            }
        });
        this.updatePath2D();
        return {
            id: this.id,
            from: {
                points: deepClone(this.original.points),
            },
            to: {
                points: deepClone(this.points),
            },
        };
    }
    rotateFrom(rotation, anchor, f) {
        if (rotation !== 0) {
            const rect = this.getBoundingRectFromOriginal();
            const onSelfCenter = rect.cx.toFixed(2) === anchor.x.toFixed(2) && rect.cy.toFixed(2) === anchor.y.toFixed(2);
            console.log(onSelfCenter);
            let newRotation;
            if (onSelfCenter) {
                newRotation = (this.original.rotation + rotation) % 360;
            }
            else {
                const matrix = new DOMMatrix()
                    .translate(anchor.x, anchor.y)
                    .rotate(rotation)
                    .translate(-anchor.x, -anchor.y);
                console.log('anchor', anchor);
                console.log('rect', rect.cx, rect.cy);
                this.points = this.original.points.map(p => {
                    const anchorPt = this.transformPoint(p.anchor.x, p.anchor.y, matrix);
                    const cp1 = p.cp1 ? this.transformPoint(p.cp1.x, p.cp1.y, matrix) : undefined;
                    const cp2 = p.cp2 ? this.transformPoint(p.cp2.x, p.cp2.y, matrix) : undefined;
                    return { anchor: anchorPt, cp1, cp2 };
                });
                newRotation = rotation;
            }
            if (newRotation < 0)
                newRotation += 360;
            this.rotation = newRotation;
        }
        this.updatePath2D();
        if (f) {
            return {
                id: this.id,
                from: {
                    rotation: this.original.rotation,
                    points: deepClone(this.original.points),
                },
                to: {
                    rotation: this.rotation,
                    points: deepClone(this.points),
                },
            };
        }
    }
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
        return ElementPath._getBoundingRect(this.original.points);
    }
    getBoundingRect() {
        return ElementPath._getBoundingRect(this.points);
    }
    toJSON() {
        return {
            // id: this.id,
            // layer: this.layer,
            type: this.type,
            points: this.points,
            closed: this.closed,
            ...super.toJSON(),
        };
    }
    toMinimalJSON() {
        return {
            // id: this.id,
            // layer: this.layer,
            type: this.type,
            points: this.points,
            closed: this.closed,
            ...super.toMinimalJSON(),
        };
    }
    getOperators(id, resizeConfig, rotateConfig, boundingRect, elementOrigin) {
        const { x: cx, y: cy, width, height } = boundingRect;
        // const id = this.id
        const { rotation } = this;
        const handlers = HANDLER_OFFSETS.map((OFFSET, index) => {
            // Calculate the handle position in local coordinates
            const currentCenterX = cx - width / 2 + OFFSET.x * width;
            const currentCenterY = cy - height / 2 + OFFSET.y * height;
            const currentElementProps = {
                id: '',
                layer: 0,
                // width: 0,
                // height: 0,
                // x: currentCenterX,
                // y: currentCenterY,
                // lineColor: '',
                // lineWidth: 0,
                rotation,
            };
            // let cursor: ResizeCursor = OFFSET.cursor as ResizeCursor
            if (OFFSET.type === 'resize') {
                const rotated = rotatePointAroundPoint(currentCenterX, currentCenterY, cx, cy, rotation);
                // cursor = getCursor(rotated.x, rotated.y, cx, cy, rotation)
                currentElementProps.id = index + '-resize';
                currentElementProps.cx = rotated.x;
                currentElementProps.cy = rotated.y;
                currentElementProps.width = resizeConfig.size;
                currentElementProps.height = resizeConfig.size;
                currentElementProps.lineWidth = resizeConfig.lineWidth;
                currentElementProps.lineColor = resizeConfig.lineColor;
                currentElementProps.fillColor = resizeConfig.fillColor;
            }
            else if (OFFSET.type === 'rotate') {
                const currentRotateHandlerCenterX = currentCenterX + OFFSET.offsetX * resizeConfig.lineWidth;
                const currentRotateHandlerCenterY = currentCenterY + OFFSET.offsetY * resizeConfig.lineWidth;
                const rotated = rotatePointAroundPoint(currentRotateHandlerCenterX, currentRotateHandlerCenterY, cx, cy, rotation);
                currentElementProps.id = index + '-rotate';
                currentElementProps.cx = rotated.x;
                currentElementProps.cy = rotated.y;
                currentElementProps.width = rotateConfig.size;
                currentElementProps.height = rotateConfig.size;
                currentElementProps.lineWidth = rotateConfig.lineWidth;
                currentElementProps.lineColor = rotateConfig.lineColor;
                currentElementProps.fillColor = rotateConfig.fillColor;
            }
            return {
                id: `${id}`,
                type: OFFSET.type,
                name: OFFSET.name,
                // cursor,
                elementOrigin,
                element: new ElementRectangle(currentElementProps),
            };
        });
        return handlers;
    }
    isInsideRect(outer) {
        const inner = this.getBoundingRect();
        return (inner.left >= outer.left &&
            inner.right <= outer.right &&
            inner.top >= outer.top &&
            inner.bottom <= outer.bottom);
    }
}
export default ElementPath;
