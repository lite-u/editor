import { generateBoundingRectFromRect, generateBoundingRectFromRotatedRect } from '../../core/utils.js';
import { DEFAULT_BORDER_RADIUS, DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../defaultProps.js';
import { isEqual } from '../../lib/lib.js';
import ElementBase from '../base/elementBase.js';
import { rotatePointAroundPoint } from '../../core/geometry.js';
import ElementPath from '../path/path.js';
class RectangleLike extends ElementBase {
    width;
    height;
    borderRadius;
    // path2D: Path2D = new Path2D()
    // private original: { cx: number, cy: number, width: number, height: number, rotation: number }
    constructor({ 
    // id,
    // layer,
    width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, borderRadius = DEFAULT_BORDER_RADIUS, ...rest }) {
        super(rest);
        // this.id = id
        // this.layer = layer
        this.width = width;
        this.height = height;
        this.borderRadius = borderRadius;
        this.original = {
            ...this.original,
            width,
            height,
        };
        this.updatePath2D();
        this.updateBoundingRect();
        this.updateOriginalBoundingRect();
    }
    static corners(prop) {
        const w = prop.width / 2;
        const h = prop.height / 2;
        return [
            { x: prop.cx - w, y: prop.cy - h }, // top-left
            { x: prop.cx + w, y: prop.cy - h }, // top-right
            { x: prop.cx + w, y: prop.cy + h }, // bottom-right
            { x: prop.cx - w, y: prop.cy + h }, // bottom-left
        ];
    }
    updatePath2D() {
        const { cx, cy, borderRadius, rotation } = this;
        const [tl, tr, br, bl] = borderRadius;
        const { top, right, bottom, left } = this.getBoundingRect(true);
        const matrix = new DOMMatrix()
            .translate(cx, cy)
            .rotate(rotation)
            .translate(-cx, -cy);
        const topLeft = matrix.transformPoint({ x: left, y: top });
        const topRight = matrix.transformPoint({ x: right, y: top });
        const bottomRight = matrix.transformPoint({ x: right, y: bottom });
        const bottomLeft = matrix.transformPoint({ x: left, y: bottom });
        this.path2D = new Path2D();
        this.path2D.moveTo(topLeft.x + tl, topLeft.y);
        if (tr > 0) {
            this.path2D.arcTo(topRight.x, topRight.y, bottomRight.x, bottomRight.y, tr);
        }
        else {
            this.path2D.lineTo(topRight.x, topRight.y);
        }
        if (br > 0) {
            this.path2D.arcTo(bottomRight.x, bottomRight.y, bottomLeft.x, bottomLeft.y, br);
        }
        else {
            this.path2D.lineTo(bottomRight.x, bottomRight.y);
        }
        if (bl > 0) {
            this.path2D.arcTo(bottomLeft.x, bottomLeft.y, topLeft.x, topLeft.y, bl);
        }
        else {
            this.path2D.lineTo(bottomLeft.x, bottomLeft.y);
        }
        if (tl > 0) {
            this.path2D.arcTo(topLeft.x, topLeft.y, topRight.x, topRight.y, tl);
        }
        else {
            this.path2D.lineTo(topLeft.x, topLeft.y);
        }
        this.path2D.closePath();
    }
    updateOriginal() {
        this.original.cx = this.cx;
        this.original.cy = this.cy;
        this.original.width = this.width;
        this.original.height = this.height;
        this.original.rotation = this.rotation;
        this.updateOriginalBoundingRect();
        // this.updatePath2D()
        // this.updateBoundingRect()
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
    scaleFrom(scaleX, scaleY, anchor, appliedRotation) {
        const { cx, cy, rotation } = this.original;
        const { top, right, bottom, left } = this.originalBoundingRectWithRotation;
        // const unRotatedAnchor = rotatePointAroundPoint(anchor.x, anchor.y, cx, cy, rotation)
        // console.log('unRotatedAnchor', unRotatedAnchor)
        const matrix = new DOMMatrix()
            .translate(anchor.x, anchor.y)
            .rotate(appliedRotation)
            .scale(scaleX, scaleY)
            .rotate(-appliedRotation)
            .translate(-anchor.x, -anchor.y);
        /*  const rotateBackMatrix = new DOMMatrix()
            .translate(-cx, -cy)
            .rotate(-rotation)
            .rotate(rotation)
            .translate(cx, cy)*/
        // const matrix = new DOMMatrix()
        // .translate(unRotatedAnchor.x, unRotatedAnchor.y)
        // .rotate(rotation)
        // .scale(scaleX, scaleY, 1, unRotatedAnchor.x, unRotatedAnchor.y)
        // .rotate(-rotation)
        // .translate(-unRotatedAnchor.x, -unRotatedAnchor.y)
        const scaledCorners = [
            { x: left, y: top },
            { x: right, y: top },
            { x: right, y: bottom },
            { x: left, y: bottom },
        ].map(({ x, y }) => {
            const rotatedPoint = rotatePointAroundPoint(x, y, cx, cy, rotation);
            const d = new DOMPoint(rotatedPoint.x, rotatedPoint.y);
            const scaledPoint = d.matrixTransform(matrix);
            const rotateBack = rotatePointAroundPoint(scaledPoint.x, scaledPoint.y, cx, cy, -rotation);
            return rotateBack;
        });
        // console.log('scaledCorners', scaledCorners)
        const xs = scaledCorners.map(p => p.x);
        const ys = scaledCorners.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        // const newCX = (minX + maxX) / 2
        // const newCY = (minY + maxY) / 2
        const newWidth = maxX - minX;
        const newHeight = maxY - minY;
        // const newCenter = new DOMPoint(cx, cy).matrixTransform(matrix)
        // const newCenter = rotatePointAroundPoint(newCX, newCY, cx, cy, rotation)
        // this.width = scaledCorners[1].x - scaledCorners[0].x
        // this.height = scaledCorners[2].y - scaledCorners[0].y
        this.width = newWidth;
        this.height = newHeight;
        const newCenter = new DOMPoint(cx, cy).matrixTransform(matrix);
        this.cx = newCenter.x;
        this.cy = newCenter.y;
        this.updatePath2D();
        this.updateBoundingRect();
        return {
            id: this.id,
            from: {
                cx: this.original.cx,
                cy: this.original.cy,
                width: this.original.width,
                height: this.original.height,
            },
            to: {
                cx: this.cx,
                cy: this.cy,
                width: this.width,
                height: this.height,
            },
        };
    }
    scaleOnPath(scaleX, scaleY, anchor, appliedRotation) {
        if (!this._shadowPath) {
            this._shadowPath = this.toPath();
            this.originalBoundingRect = this._shadowPath.originalBoundingRect;
            this.originalBoundingRectWithRotation = this._shadowPath.originalBoundingRectWithRotation;
        }
        this._shadowPath.scaleFrom(scaleX, scaleY, anchor, appliedRotation);
        this.path2D = this._shadowPath.path2D;
        this.boundingRect = this._shadowPath.boundingRect;
    }
    toJSON() {
        const { borderRadius, width, height, } = this;
        if (!borderRadius) {
            debugger;
        }
        return {
            ...super.toJSON(),
            borderRadius: [...borderRadius],
            width,
            height,
        };
    }
    toMinimalJSON() {
        const result = {
            ...super.toMinimalJSON(),
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
    toPath() {
        const { id, layer, borderRadius, ...rest } = this.toJSON();
        const { cx, cy, width, height, rotation } = this.original;
        const [tl, tr, br, bl] = borderRadius;
        const halfW = width / 2;
        const halfH = height / 2;
        const corners = [
            { x: cx - halfW + tl, y: cy - halfH }, // top-left start
            { x: cx + halfW - tr, y: cy - halfH }, // top-right start
            { x: cx + halfW, y: cy - halfH + tr }, // top-right arc
            { x: cx + halfW, y: cy + halfH - br }, // bottom-right start
            { x: cx + halfW - br, y: cy + halfH }, // bottom-right arc
            { x: cx - halfW + bl, y: cy + halfH }, // bottom-left start
            { x: cx - halfW, y: cy + halfH - bl }, // bottom-left arc
            { x: cx - halfW, y: cy - halfH + tl }, // top-left arc
        ];
        const rotatedPoints = corners.map(p => rotatePointAroundPoint(p.x, p.y, cx, cy, rotation));
        const points = rotatedPoints.map(p => ({
            anchor: p,
            cp1: null,
            cp2: null,
            type: 'corner',
        }));
        // const { points, closed } = convertDrawPointsToBezierPoints(rotatedPoints)
        return new ElementPath({
            id,
            layer,
            type: 'path',
            points,
            closed,
            ...rest,
        });
    }
    getBoundingRect(withoutRotation = false) {
        const { cx, cy, width, height, rotation } = this;
        const x = cx - width / 2;
        const y = cy - height / 2;
        if (rotation === 0 || withoutRotation) {
            return generateBoundingRectFromRect({ x, y, width, height });
        }
        return generateBoundingRectFromRotatedRect({ x, y, width, height }, rotation);
    }
    getBoundingRectFromOriginal(withoutRotation = false) {
        const { cx, cy, width, height, rotation } = this.original;
        const x = cx - width / 2;
        const y = cy - height / 2;
        if (rotation === 0 || withoutRotation) {
            return generateBoundingRectFromRect({ x, y, width: width, height: height });
        }
        return generateBoundingRectFromRotatedRect({ x, y, width: width, height: height }, rotation);
    }
}
export default RectangleLike;
