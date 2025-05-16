import ElementBase, {ElementBaseProps} from '~/elements/base/elementBase'
import {BasePath} from '~/elements/basePath/basePath'
import {BoundingRect, Point, UID} from '~/type'
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
  private original: { points: [{ id: 'start' } & Point, { id: 'end' } & Point], rotation: number }

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
    this.original = {
      points: deepClone(points),
      rotation: this.rotation,
    }
  }

  protected getPoints(): Point[] {
    return Object.values(this.points).map(p => p)
  }

  static _getBoundingRect(start, end, rotation): BoundingRect {
    const x = Math.min(start.x, end.x)
    const y = Math.min(start.y, end.y)
    const width = Math.abs(end.x - start.x)
    const height = Math.abs(end.y - start.y)

    if (rotation === 0) {
      return generateBoundingRectFromRect({x, y, width, height})
    }

    return generateBoundingRectFromRotatedRect({x, y, width, height}, rotation)
  }

  public getBoundingRect(): BoundingRect {
    const [start, end] = this.points
    return ElementLineSegment._getBoundingRect(start, end, this.rotation)
  }

  public getBoundingRectFromOriginal() {
    const [start, end] = this.original.points
    return ElementLineSegment._getBoundingRect(start, end, this.original.rotation)
  }

  translate(dx: number, dy: number) {
    this.points.forEach((point: Point) => {
      point.x += dx
      point.y += dy
    })
  }

  scaleFrom(scaleX: number, scaleY: number, anchor: Point) {
    const [start, end] = this.points
    const [oStart, oEnd] = this.original.points
    const matrix = new DOMMatrix()
      .translate(anchor.x, anchor.y)
      .scale(scaleX, scaleY)
      .translate(-anchor.x, -anchor.y)

    const newStart = this.transformPoint(oStart.x, oStart.y, matrix)
    const newEnd = this.transformPoint(oEnd.x, oEnd.y, matrix)

    start.x = newStart.x
    start.y = newStart.y
    end.x = newEnd.x
    end.y = newEnd.y
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
    const [start, end] = this.points

    ctx.save()
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
    ctx.restore()

  }
}

export default ElementLineSegment