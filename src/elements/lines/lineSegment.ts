import ElementBase, {ElementBaseProps} from '~/elements/base/elementBase'
import {BasePath} from '~/elements/basePath/basePath'
import {Point} from '~/type'
import deepClone from '~/core/deepClone'

export interface LineSegmentProps extends ElementBaseProps {
  id: string
  layer: number
  type: 'lineSegment'
  points: Point[];
}

export type RequiredLineSegmentProps = Required<LineSegmentProps>

class LineSegment extends ElementBase implements BasePath {
  readonly id: string
  readonly layer: number
  readonly type = 'lineSegment'
  private points: Point[] = []
  private original: { points: Point[] }

  constructor({
                id,
                layer,
                points = [],
                ...rest
              }: LineSegmentProps) {
    super(rest)
    this.id = id
    this.layer = layer
    this.points = points
    this.original = {points: []}
  }

  translate(dx: number, dy: number) {
    this.points.forEach((point: Point) => {
      point.x += dx
      point.y += dy
    })
  }

  scaleFrom(scaleX: number, scaleY: number, anchor: Point) {
    // console.log(scaleX, scaleY, anchor)
    const matrix = new DOMMatrix()
      .translate(anchor.x, anchor.y)
      .scale(scaleX, scaleY)
      .translate(-anchor.x, -anchor.y)
    /*
        const {cx, cy, width, height} = this.original
        const topLeft = this.transformPoint(cx - width / 2, cy - height / 2, matrix)
        const bottomRight = this.transformPoint(cx + width / 2, cy + height / 2, matrix)

        this.cx = (topLeft.x + bottomRight.x) / 2
        this.cy = (topLeft.y + bottomRight.y) / 2
        this.width = Math.abs(bottomRight.x - topLeft.x)
        this.height = Math.abs(bottomRight.y - topLeft.y)*/

    // console.log(this.cx, this.cy, this.width, this.height)
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

  render() {

  }
}

export default LineSegment