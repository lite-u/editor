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

  public updateOriginal() {
    this.original.cx = this.cx
    this.original.cy = this.cy
    this.original.points = deepClone(this.points)
    this.original.closed = this.closed
    this.original.rotation = this.rotation

    this.updatePath2D()
    this.updateBoundingRect()
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

  getBezierPoints(): BezierPoint[] {
    const {cx, cy} = this
    const transform = new DOMMatrix()
      .translate(cx, cy)
      // .rotate(this.rotation)
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

  public rotateFrom(rotation: number, anchor: Point, f: boolean): HistoryChangeItem | undefined {
    const {cx, cy, points} = this.original
    const newPoints = ElementPath._rotateBezierPointsFrom(anchor.x, anchor.y, rotation, points!)
    const {x, y} = rotatePointAroundPoint(cx, cy, anchor.x, anchor.y, rotation)

    let newRotation = (this.original.rotation + rotation) % 360
    if (newRotation < 0) newRotation += 360

    this.cx = x
    this.cy = y
    this.rotation = newRotation
    this.points = newPoints

    this.updatePath2D()
    this.updateBoundingRect()

    if (f) {
      return {
        id: this.id,
        from: {
          cx: this.original.cx,
          cy: this.original.cy,
          rotation: this.original.rotation,
          points: deepClone(this.original.points),

        },
        to: {
          cx: this.cx,
          cy: this.cy,
          rotation: this.rotation,
          points: deepClone(this.points),

        },
      }
    }
  }

  scaleFrom(scaleX: number, scaleY: number, anchor: Point): HistoryChangeItem | undefined {
    const matrix = new DOMMatrix()
      .translate(anchor.x, anchor.y)
      .scale(scaleX, scaleY)
      .translate(-anchor.x, -anchor.y)

    this.points = this.points.map(({anchor, cp1, cp2, type, symmetric}): BezierPoint => {
      const newAnchor = new DOMPoint(anchor.x, anchor.y).matrixTransform(matrix)
      const newCP1 = cp1 ?? new DOMPoint(cp1.x, cp1.y).matrixTransform(matrix)
      const newCP2 = cp2 ?? new DOMPoint(cp2.x, cp2.y).matrixTransform(matrix)

      return {
        type,
        symmetric,
        anchor: newAnchor,
        cp1: newCP1,
        cp2: newCP2,
      }
    })

    const newAnchor = new DOMPoint(this.cx, this.cy).matrixTransform(matrix)

    this.cx = newAnchor.x
    this.cy = newAnchor.y
    this.updatePath2D()
    this.updateBoundingRect()

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

  public getBoundingRect(withoutRotation: boolean = false): BoundingRect {
    const {cx, cy, rotation, points} = this
    const r = withoutRotation ? -rotation : 0
    const transformedPoints = ElementPath._rotateBezierPointsFrom(cx, cy, r, points)

    return getBoundingRectFromBezierPoints(transformedPoints)
  }

  getBoundingRectFromOriginal(withoutRotation: boolean = false) {
    const {cx, cy, rotation, points} = this.original
    const r = withoutRotation ? -rotation : 0

    const transformedPoints = ElementPath._rotateBezierPointsFrom(cx, cy, r, points!)

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