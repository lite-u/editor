import {BoundingRect, Point} from '~/type'
import {AnchorPoint, Appearance, Fill, Stroke, Transform} from '~/elements/defaultProps'
import {BezierPoint} from '~/elements/props'
import deepClone from '~/core/deepClone'
import ElementShape, {ShapeProps} from '~/elements/shape/shape'
import ElementBase from '~/elements/base/elementBase'

export interface PathProps extends ShapeProps {
  // id: UID,
  // layer: number
  type: 'path'
  points: BezierPoint[];
  closed: boolean;
  // group: string | null;
}

export type RequiredShapeProps = Required<PathProps>

class ElementPath extends ElementShape {
  // readonly id: UID
  // readonly layer: number
  readonly type = 'path'
  private points: BezierPoint[] = []
  // private cx: number
  // private cy: number
  closed: boolean

  // private original: { cx: number, cy: number, points: BezierPoint[], closed: boolean, rotation: number }

  constructor({points = [], closed = false, ...rest}: PathProps) {
    super(rest)
    this.points = deepClone(points)
    this.closed = closed

    this.original = {
      ...this.original,
      closed,
      points: deepClone(points),
      rotation: this.rotation,
    }
    this.updatePath2D()
  }

  static cubicBezier(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point {
    const mt = 1 - t
    const mt2 = mt * mt
    const t2 = t * t

    return {
      x: mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x,
      y: mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y,
    }
  }

  protected updateOriginal() {
    this.original.cx = this.cx
    this.original.cy = this.cy
    this.original.points = deepClone(this.points)
    this.original.closed = this.closed
    this.original.rotation = this.rotation

    this.updatePath2D()
  }

  get center(): Point {
    return {
      x: this.cx,
      y: this.cy,
    }
  }

  get getPoints(): Point[] {
    return this.points.map(p => ({...p.anchor}))
  }

  protected updatePath2D() {
    if (this.points.length === 0) return

    this.path2D = new Path2D()

    const {cx, cy} = this
    const transform = new DOMMatrix()
      .translate(cx, cy)
      .rotate(this.rotation)
      .translate(-cx, -cy)

    const startAnchor = this.points[0].anchor
    const start = ElementBase.transformPoint(startAnchor.x + cx, startAnchor.y + cy, transform)
    this.path2D.moveTo(start.x, start.y)

    for (let i = 1; i < this.points.length; i++) {
      const prev = this.points[i - 1]
      const curr = this.points[i]
      const cp1 = prev.cp2
        ? ElementBase.transformPoint(prev.cp2.x + cx, prev.cp2.y + cy, transform)
        : ElementBase.transformPoint(prev.anchor.x + cx, prev.anchor.y + cy, transform)
      const cp2 = curr.cp1
        ? ElementBase.transformPoint(curr.cp1.x + cx, curr.cp1.y + cy, transform)
        : ElementBase.transformPoint(curr.anchor.x + cx, curr.anchor.y + cy, transform)
      const anchor = ElementBase.transformPoint(curr.anchor.x + cx, curr.anchor.y + cy, transform)

      this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, anchor.x, anchor.y)
    }

    if (this.closed && this.points.length > 1) {
      const last = this.points[this.points.length - 1]
      const first = this.points[0]
      const cp1 = last.cp2
        ? ElementBase.transformPoint(last.cp2.x + cx, last.cp2.y + cy, transform)
        : ElementBase.transformPoint(last.anchor.x + cx, last.anchor.y + cy, transform)
      const cp2 = first.cp1
        ? ElementBase.transformPoint(first.cp1.x + cx, first.cp1.y + cy, transform)
        : ElementBase.transformPoint(first.anchor.x + cx, first.anchor.y + cy, transform)
      const anchor = ElementBase.transformPoint(first.anchor.x + cx, first.anchor.y + cy, transform)

      this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, anchor.x, anchor.y)
      this.path2D.closePath()
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
           const anchorPt = ElementBase.transformPoint(p.anchor.x + this.cx, p.anchor.y + this.cy, matrix)
           const cp1 = p.cp1 ? ElementBase.transformPoint(p.cp1.x + this.cx, p.cp1.y + this.cy, matrix) : undefined
           const cp2 = p.cp2 ? ElementBase.transformPoint(p.cp2.x + this.cx, p.cp2.y + this.cy, matrix) : undefined
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
  scaleFrom(scaleX: number, scaleY: number, anchor: Point) {
    /*// console.log(scaleX, scaleY, anchor)
    const matrix = new DOMMatrix()
      .translate(anchor.x, anchor.y)
      .scale(scaleX, scaleY)
      .translate(-anchor.x, -anchor.y)

    const {cx, cy, width, height} = this.original
    const topLeft = ElementBase.transformPoint(cx - width / 2, cy - height / 2, matrix)
    const bottomRight = ElementBase.transformPoint(cx + width / 2, cy + height / 2, matrix)

    this.cx = (topLeft.x + bottomRight.x) / 2
    this.cy = (topLeft.y + bottomRight.y) / 2
    this.width = Math.abs(bottomRight.x - topLeft.x)
    this.height = Math.abs(bottomRight.y - topLeft.y)

    this.updatePath2D()*/
    // console.log(this.cx, this.cy, this.width, this.height)
  }

  static _getBoundingRect(points: BezierPoint[]): BoundingRect {
    const samplePoints: Point[] = []

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]

      const p0 = prev.anchor
      const p1 = prev.cp2 ?? prev.anchor
      const p2 = curr.cp1 ?? curr.anchor
      const p3 = curr.anchor

      for (let t = 0; t <= 1; t += 0.05) {
        samplePoints.push(ElementPath.cubicBezier(t, p0, p1, p2, p3))
      }
    }

    if (points.length === 1) {
      samplePoints.push(points[0].anchor)
    }

    const xs = samplePoints.map(p => p.x)
    const ys = samplePoints.map(p => p.y)

    const left = Math.min(...xs)
    const right = Math.max(...xs)
    const top = Math.min(...ys)
    const bottom = Math.max(...ys)
    const width = right - left
    const height = bottom - top
    const x = left
    const y = top
    const cx = x + width / 2
    const cy = y + height / 2

    return {x, y, width, height, left, right, top, bottom, cx, cy}
  }

  static _getBoundingRectFromRelativePoints(cx: number, cy: number, rotation: number, points: BezierPoint[]): BoundingRect {
    const matrix = new DOMMatrix()
      .translate(cx, cy)
      .rotate(rotation)
      .translate(-cx, -cy)

    const transformedPoints: BezierPoint[] = points.map(p => ({
      anchor: rotation
        ? ElementBase.transformPoint(p.anchor.x + cx, p.anchor.y + cy, matrix)
        : {x: p.anchor.x + cx, y: p.anchor.y + cy},
      cp1: p.cp1
        ? (rotation
          ? ElementPath.transformPoint(p.cp1.x + cx, p.cp1.y + cy, matrix)
          : {x: p.cp1.x + cx, y: p.cp1.y + cy})
        : undefined,
      cp2: p.cp2
        ? (rotation
          ? ElementPath.transformPoint(p.cp2.x + cx, p.cp2.y + cy, matrix)
          : {x: p.cp2.x + cx, y: p.cp2.y + cy})
        : undefined,
    })) as BezierPoint[]

    return ElementPath._getBoundingRect(transformedPoints)
  }

  getBoundingRectFromOriginal() {
    const {cx, cy, rotation, points} = this.original

    return ElementPath._getBoundingRectFromRelativePoints(cx, cy, rotation, points)
  }

  public getBoundingRect(withoutRotation: boolean = false): BoundingRect {
    const {cx, cy, rotation, points} = this
    const r = withoutRotation ? 0 : rotation

    return ElementPath._getBoundingRectFromRelativePoints(cx, cy, r, points)

  }

  protected toJSON(): RequiredShapeProps {
    return {
      type: this.type,
      points: this.points,
      closed: this.closed,
      ...super.toJSON(),
    }
  }

  public toMinimalJSON(): PathProps {
    return {
      type: this.type,
      points: this.points,
      closed: this.closed,
      ...super.toMinimalJSON(),
    }
  }
}

export default ElementPath