import ElementBase, {ElementBaseProps} from '~/elements/base/elementBase'
import {BasePath} from '~/elements/basePath/basePath'
import {Point} from '~/type'
import deepClone from '~/core/deepClone'

export interface LineSegmentProps extends ElementBaseProps {
  id: string
  layer: number
  type: 'path'
  points: Point[];
}

export type RequiredLineSegmentProps = Required<LineSegmentProps>

class LineSegment extends ElementBase implements BasePath {
  readonly id: string
  readonly layer: number
  readonly type = 'path'
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

}

export default LineSegment