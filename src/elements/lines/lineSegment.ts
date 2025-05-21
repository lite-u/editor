import ElementBase, {ElementBaseProps} from '~/elements/base/elementBase'
import {BoundingRect, Point} from '~/type'
import deepClone from '~/core/deepClone'
import {generateBoundingRectFromRect, generateBoundingRectFromRotatedRect} from '~/core/utils'
import {HistoryChangeItem} from '~/services/actions/type'

export interface LineSegmentProps extends ElementBaseProps {
  // id: string
  // layer: number
  type: 'lineSegment'
  points: [{ id: 'start' } & Point, { id: 'end' } & Point]
}

export type RequiredLineSegmentProps = Required<LineSegmentProps>

class ElementLineSegment extends ElementBase {
  readonly type = 'lineSegment'
  private points: [{ id: 'start' } & Point, { id: 'end' } & Point]

  constructor({
                points,
                ...rest
              }: LineSegmentProps) {
    super(rest)
    this.points = points
    this.original = {
      ...this.original,
      points: deepClone(points),
      rotation: this.rotation,
    }
    this.updatePath2D()
  }

  protected updatePath2D() {
    const {cx, cy, rotation} = this
    const [start, end] = this.points

    const absStart = {x: start.x + cx, y: start.y + cy}
    const absEnd = {x: end.x + cx, y: end.y + cy}

    const matrix = new DOMMatrix()
      .translate(cx, cy)
      .rotate(rotation)
      .translate(-cx, -cy)

    const rotatedStart = ElementBase.transformPoint(absStart.x, absStart.y, matrix)
    const rotatedEnd = ElementBase.transformPoint(absEnd.x, absEnd.y, matrix)

    this.path2D = new Path2D()
    this.path2D.moveTo(rotatedStart.x, rotatedStart.y)
    this.path2D.lineTo(rotatedEnd.x, rotatedEnd.y)
  }

  protected updateOriginal() {
    this.original.points = deepClone(this.points)
    this.original.rotation = this.rotation
    this.updatePath2D()
  }

  public get getPoints(): Point[] {
    return this.points.map(p => ({x: p.x, y: p.y}))
  }

  static _getBoundingRect(start: Point, end: Point, rotation: number = 0): BoundingRect {
    const x = Math.min(start.x, end.x)
    const y = Math.min(start.y, end.y)
    let width = Math.abs(end.x - start.x)
    let height = Math.abs(end.y - start.y)

    if (width <= 0) {
      width = 1
    }
    if (height <= 0) {
      height = 1
    }

    if (rotation === 0) {
      return generateBoundingRectFromRect({x, y, width, height})
    }

    return generateBoundingRectFromRotatedRect({x, y, width, height}, rotation)
  }

  public getBoundingRect(withoutRotation: boolean = false): BoundingRect {
    const {cx, cy, points: [start, end], rotation} = this

    const aStart = {x: start.x + cx, y: start.y + cy}
    const aEnd = {x: end.x + cx, y: end.y + cy}

    const r = withoutRotation ? 0 : rotation

    return ElementLineSegment._getBoundingRect(aStart, aEnd, r)
  }

  public getBoundingRectFromOriginal() {
    const {cx, cy, points: [start, end], rotation} = this

    const aStart = {x: start.x + cx, y: start.y + cy}
    const aEnd = {x: end.x + cx, y: end.y + cy}
    return ElementLineSegment._getBoundingRect(aStart, aEnd, rotation)
  }

  translate(dx: number, dy: number, f: boolean): HistoryChangeItem | undefined {
    this.points.forEach((point: Point) => {
      point.x += dx
      point.y += dy
    })

    this.updatePath2D()
    if (f) {
      return {
        id: this.id,
        from: {
          points: deepClone(this.original.points),
        },
        to: {
          points: deepClone(this.points),
        },
      }
    }
  }

  scaleFrom(scaleX: number, scaleY: number, anchor: Point) {
    const matrix = new DOMMatrix()
      .translate(anchor.x, anchor.y)
      .scale(scaleX, scaleY)
      .translate(-anchor.x, -anchor.y)

    const [oStart, oEnd] = this.original.points
    // Adjust to absolute coordinates for transformation
    const newStart = ElementBase.transformPoint(oStart.x + this.cx, oStart.y + this.cy, matrix)
    const newEnd = ElementBase.transformPoint(oEnd.x + this.cx, oEnd.y + this.cy, matrix)

    // Store back as relative to cx, cy
    this.points[0].x = newStart.x - this.cx
    this.points[0].y = newStart.y - this.cy
    this.points[1].x = newEnd.x - this.cx
    this.points[1].y = newEnd.y - this.cy

    this.updatePath2D()
  }

  protected toJSON(): RequiredLineSegmentProps {
    return {
      ...super.toJSON(),
      // id: this.id,
      // layer: this.layer,
      type: this.type,
      points: deepClone(this.points),
    }
  }

  public toMinimalJSON(): LineSegmentProps {
    return {
      ...super.toMinimalJSON(),
      // id: this.id,
      // layer: this.layer,
      type: this.type,
      points: deepClone(this.points),
    }
  }
}

export default ElementLineSegment