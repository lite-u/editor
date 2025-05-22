import {BoundingRect, Point} from '~/type'
import {AnchorPoint, Appearance, Fill, Stroke, Transform} from '~/elements/defaultProps'
import {BezierPoint} from '~/elements/props'
import deepClone from '~/core/deepClone'
import ElementBase, {ElementBaseProps} from '~/elements/base/elementBase'

export interface PathProps extends ElementBaseProps {
  // id: UID,
  // layer: number
  type: 'path'
  points: BezierPoint[];
  closed: boolean;
  // group: string | null;
}

export type RequiredShapeProps = Required<PathProps>

class ElementPath extends ElementBase {
  readonly type = 'path'
  private points: BezierPoint[] = []
  closed: boolean

  constructor({points = [], closed = false, ...rest}: PathProps) {
    super(rest)
    this.points = deepClone(points)
    this.closed = closed
    // debugger
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

  getBezierPoints(): BezierPoint[] {

    return deepClone(this.points)
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

      const prevType = prev.type ?? 'directional'
      const currType = curr.type ?? 'directional'

      const cp1 = prevType === 'corner' ? prev.anchor : (prev.cp2 ?? prev.anchor)
      const cp2 = currType === 'corner' ? curr.anchor : (curr.cp1 ?? curr.anchor)
      const anchor = curr.anchor

      const t_cp1 = ElementBase.transformPoint(cp1.x + cx, cp1.y + cy, transform)
      const t_cp2 = ElementBase.transformPoint(cp2.x + cx, cp2.y + cy, transform)
      const t_anchor = ElementBase.transformPoint(anchor.x + cx, anchor.y + cy, transform)

      this.path2D.bezierCurveTo(t_cp1.x, t_cp1.y, t_cp2.x, t_cp2.y, t_anchor.x, t_anchor.y)
    }

    if (this.closed && this.points.length > 1) {
      const last = this.points[this.points.length - 1]
      const first = this.points[0]

      const lastType = last.type ?? 'directional'
      const firstType = first.type ?? 'directional'

      const cp1 = lastType === 'corner' ? last.anchor : (last.cp2 ?? last.anchor)
      const cp2 = firstType === 'corner' ? first.anchor : (first.cp1 ?? first.anchor)
      const anchor = first.anchor

      const t_cp1 = ElementBase.transformPoint(cp1.x + cx, cp1.y + cy, transform)
      const t_cp2 = ElementBase.transformPoint(cp2.x + cx, cp2.y + cy, transform)
      const t_anchor = ElementBase.transformPoint(anchor.x + cx, anchor.y + cy, transform)

      this.path2D.bezierCurveTo(t_cp1.x, t_cp1.y, t_cp2.x, t_cp2.y, t_anchor.x, t_anchor.y)
      this.path2D.closePath()
    }
  }

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