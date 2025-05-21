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
    const [start, end] = this.points
    const startX = start.x + this.cx
    const startY = start.y + this.cy
    const endX = end.x + this.cx
    const endY = end.y + this.cy

    this.path2D = new Path2D()
    this.path2D.moveTo(startX, startY)
    this.path2D.lineTo(endX, endY)
  }

  protected updateOriginal() {
    this.original.points = deepClone(this.points)
    this.original.rotation = this.rotation
    this.updatePath2D()
  }

  protected get center(): Point {
    const rect = this.getBoundingRect()

    return {x: rect.cx, y: rect.cy}
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
    // console.log(width, height)
    if (rotation === 0) {
      return generateBoundingRectFromRect({x, y, width, height})
    }

    return generateBoundingRectFromRotatedRect({x, y, width, height}, rotation)
  }

  public getBoundingRect(): BoundingRect {
    const [start, end] = this.points

    return ElementLineSegment._getBoundingRect(start, end)
  }

  public getBoundingRectFromOriginal() {
    const [start, end] = this.original.points
    return ElementLineSegment._getBoundingRect(start, end)
  }

  translate(dx: number, dy: number, f: boolean): HistoryChangeItem | undefined {
    this.points.forEach((point: Point) => {
      point.x += dx
      point.y += dy
    })

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

  rotateFrom(rotation: number, anchor: Point, f: boolean): HistoryChangeItem | undefined {
    if (rotation !== 0) {
      const matrix = new DOMMatrix()
        .translate(anchor.x, anchor.y)
        .rotate(rotation)
        .translate(-anchor.x, -anchor.y)

      const [oStart, oEnd] = this.original.points
      const newStart = ElementBase.transformPoint(oStart.x, oStart.y, matrix)
      const newEnd = ElementBase.transformPoint(oEnd.x, oEnd.y, matrix)

      this.points[0].x = newStart.x
      this.points[0].y = newStart.y
      this.points[1].x = newEnd.x
      this.points[1].y = newEnd.y

      let newRotation = (this.original.rotation + rotation) % 360
      if (newRotation < 0) newRotation += 360
      this.rotation = newRotation

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
          points: deepClone(this.points),
          rotation: this.rotation,
        },
      }
    }
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