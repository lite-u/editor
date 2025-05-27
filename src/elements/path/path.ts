import ElementBase, {ElementBaseProps} from '~/elements/base/elementBase'
import {BoundingRect, Point} from '~/type'
import {BezierPoint} from '~/elements/props'
import deepClone from '~/core/deepClone'
import {HistoryChangeItem} from '~/services/actions/type'
import {getBoundingRectFromBezierPoints, rotatePointAroundPoint} from '~/core/geometry'

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
    this.updateBoundingRect()
  }

  /*  static cubicBezier(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point {
      const mt = 1 - t
      const mt2 = mt * mt
      const t2 = t * t

      return {
        x: mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x,
        y: mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y,
      }
    }*/

  public updateOriginal() {
    this.original.cx = this.cx
    this.original.cy = this.cy
    this.original.points = deepClone(this.points)
    this.original.closed = this.closed
    this.original.rotation = this.rotation

    this.updatePath2D()
    this.updateBoundingRect()
  }

  /**
   * Return absolute position points
   */
  getBezierPoints(): BezierPoint[] {
    const {cx, cy} = this
    const transform = new DOMMatrix()
      .translate(cx, cy)
      .rotate(this.rotation)
      .translate(-cx, -cy)

    return this.points.map(({anchor, cp1, cp2, type}) => {
      const t_cp1 = cp1 ? ElementBase.transformPoint(cp1.x, cp1.y, transform) : null
      const t_cp2 = cp2 ? ElementBase.transformPoint(cp2.x, cp2.y, transform) : null
      const t_anchor = ElementBase.transformPoint(anchor.x, anchor.y, transform)

      return {
        type,
        anchor: t_anchor,
        cp1: t_cp1,
        cp2: t_cp2,
      }
    })
  }

  public updatePath2D() {
    if (this.points.length === 0) return

    const start = this.points[0].anchor

    this.path2D = new Path2D()
    this.path2D.moveTo(start.x, start.y)

    for (let i = 1; i < this.points.length; i++) {
      const prev = this.points[i - 1]
      const curr = this.points[i]

      const prevType = prev.type ?? 'directional'
      const currType = curr.type ?? 'directional'

      const cp1 = prevType === 'corner' ? prev.anchor : (prev.cp2 ?? prev.anchor)
      const cp2 = currType === 'corner' ? curr.anchor : (curr.cp1 ?? curr.anchor)
      const anchor = curr.anchor

      this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, anchor.x, anchor.y)
    }

    if (this.closed && this.points.length > 1) {
      const last = this.points[this.points.length - 1]
      const first = this.points[0]

      const lastType = last.type ?? 'directional'
      const firstType = first.type ?? 'directional'

      const cp1 = lastType === 'corner' ? last.anchor : (last.cp2 ?? last.anchor)
      const cp2 = firstType === 'corner' ? first.anchor : (first.cp1 ?? first.anchor)
      const anchor = first.anchor

      this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, anchor.x, anchor.y)
      this.path2D.closePath()
    }
  }

  public translate(dx: number, dy: number, f: boolean): HistoryChangeItem | undefined {
    this.cx = this.cx + dx
    this.cy = this.cy + dy
    this.points.forEach((point) => {
      point.anchor.x += dx
      point.anchor.y += dy

      if (point.cp1) {
        point.cp1.x += dx
        point.cp1.y += dy
      }

      if (point.cp2) {
        point.cp2.x += dx
        point.cp2.y += dy
      }
    })

    this.updatePath2D()
    this.updateBoundingRect()

    // this.transform.cx = this.cx
    // this.transform.cy = this.cy

    this.eventListeners['move']?.forEach(handler => handler({dx, dy}))

    if (f) {
      return {
        id: this.id,
        from: {
          cx: this.original.cx,
          cy: this.original.cy,
          points: deepClone(this.original.points),
        },
        to: {
          cx: this.cx,
          cy: this.cy,
          points: deepClone(this.points),
        },
      }
    }
  }

  protected rotateFrom(rotation: number, anchor: Point, f: boolean): HistoryChangeItem | undefined {
    const {cx, cy, points} = this.original
    // rotate points to theirs real position
    // const newRotation = this.original.rotation - rotation
    // const realPositionPoints = ElementPath._rotateBezierPointsFrom(cx, cy, this.original.rotation, points)
    const transformedPoints = ElementPath._rotateBezierPointsFrom(anchor.x, anchor.y, rotation, points!)
    // const newPoints = ElementPath._rotateBezierPointsFrom(anchor.x, anchor.y, rotation, transformedPoints)

    const {x, y} = rotatePointAroundPoint(cx, cy, anchor.x, anchor.y, rotation)

    let newRotation = (this.original.rotation + rotation) % 360
    if (newRotation < 0) newRotation += 360

    this.cx = x
    this.cy = y
    this.rotation = newRotation
    this.points = transformedPoints
    /*
        const matrix = new DOMMatrix()
          .translate(anchor.x, anchor.y)
          .rotate(rotation)
          .translate(-anchor.x, -anchor.y)
        const {cx, cy} = this.original
        const transformed = matrix.transformPoint({x: cx, y: cy})
        let newRotation = (this.original.rotation + rotation) % 360

        if (newRotation < 0) newRotation += 360*/

    // this.rotation = newRotation
    // this.cx = transformed.x
    // this.cy = transformed.y

    this.updatePath2D()
    this.updateBoundingRect()

    // this.updateTransform()

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
      }
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

  static _rotateBezierPointsFrom(cx: number, cy: number, rotation: number, points: BezierPoint[]): BezierPoint[] {
    const matrix = new DOMMatrix()
      .translate(cx, cy)
      .rotate(rotation)
      .translate(-cx, -cy)

    const transformedPoints: BezierPoint[] = points.map(p => ({
      anchor: rotation
        ? ElementBase.transformPoint(p.anchor.x, p.anchor.y, matrix)
        : {x: p.anchor.x, y: p.anchor.y},
      cp1: p.cp1
        ? (rotation
          ? ElementPath.transformPoint(p.cp1.x, p.cp1.y, matrix)
          : {x: p.cp1.x, y: p.cp1.y})
        : undefined,
      cp2: p.cp2
        ? (rotation
          ? ElementPath.transformPoint(p.cp2.x, p.cp2.y, matrix)
          : {x: p.cp2.x, y: p.cp2.y})
        : undefined,
    })) as BezierPoint[]

    return transformedPoints
  }

  getBoundingRectFromOriginal() {
    const {cx, cy, rotation, points} = this.original
    const transformedPoints = ElementPath._rotateBezierPointsFrom(cx, cy, rotation, points!)

    return getBoundingRectFromBezierPoints(transformedPoints)
  }

  public getBoundingRect(withoutRotation: boolean = false): BoundingRect {
    const {cx, cy, rotation, points} = this
    const r = withoutRotation ? 0 : rotation
    const transformedPoints = ElementPath._rotateBezierPointsFrom(cx, cy, r, points)

    return getBoundingRectFromBezierPoints(transformedPoints)
  }

  public toJSON(): RequiredShapeProps {
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