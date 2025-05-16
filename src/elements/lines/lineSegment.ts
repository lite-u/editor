import ElementBase, {ElementBaseProps} from '~/elements/base/elementBase'
import {BasePath} from '~/elements/basePath/basePath'
import {Point, UID} from '~/type'
import deepClone from '~/core/deepClone'
import {generateBoundingRectFromRect, generateBoundingRectFromRotatedRect} from '~/core/utils'

type NamedPoint = { id: UID } & Point

export interface LineSegmentProps extends ElementBaseProps {
  id: string
  layer: number
  type: 'lineSegment'
  points: [{ id: 'start' } & Point, { id: 'end' } & Point]
}

export type RequiredLineSegmentProps = Required<LineSegmentProps>

class ElementLineSegment extends ElementBase implements BasePath {
  readonly id: string
  readonly layer: number
  readonly type = 'lineSegment'
  private points: [{ id: 'start' } & Point, { id: 'end' } & Point]
  private original: { points: [{ id: 'start' } & Point, { id: 'end' } & Point] }

  constructor({
                id,
                layer,
                points,
                ...rest
              }: LineSegmentProps) {
    super(rest)
    this.id = id
    this.layer = layer
    this.points = points
    this.original = {points: deepClone(points)}
  }

  protected getPoints(): Point[] {
    return Object.values(this.points).map(p => p)
  }

  public getBoundingRect() {
    const {points} = this

    const x = cx - width / 2
    const y = cy - height / 2

    if (rotation === 0) {
      return generateBoundingRectFromRect({x, y, width, height})
    }

    return generateBoundingRectFromRotatedRect({x, y, width, height}, rotation)
  }

  public getBoundingRectFromOriginal() {
    const {cx, cy, width, height, rotation} = this.original

    const x = cx - width / 2
    const y = cy - height / 2

    if (rotation === 0) {
      return generateBoundingRectFromRect({x, y, width, height})
    }

    return generateBoundingRectFromRotatedRect({x, y, width, height}, rotation)
  }

  translate(dx: number, dy: number) {
    Object.values(this.points).forEach((point: Point) => {
      point.x += dx
      point.y += dy
    })
  }

  scaleFrom(scaleX: number, scaleY: number, anchor: Point) {
    const matrix = new DOMMatrix()
      .translate(anchor.x, anchor.y)
      .scale(scaleX, scaleY)
      .translate(-anchor.x, -anchor.y)

    const newStart = this.transformPoint(this.original.points.start.x, this.original.points.start.y, matrix)
    const newEnd = this.transformPoint(this.original.points.end.x, this.original.points.end.y, matrix)

    this.points.start = newStart
    this.points.end = newEnd
  }

  protected toJSON(): RequiredLineSegmentProps {
    return {
      ...super.toJSON(),
      id: this.id,
      layer: this.layer,
      type: this.type,
      points: deepClone(this.points),
    }
  }

  public toMinimalJSON(): LineSegmentProps {
    return {
      ...super.toMinimalJSON(),
      id: this.id,
      layer: this.layer,
      type: this.type,
      points: deepClone(this.points),
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const {start, end} = this.points
    ctx.save()
    ctx.beginPath() // Start a new path

    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
    ctx.restore()

  }
}

export default ElementLineSegment