import Shape, {ShapeProps} from '../shape/shape'
import {CenterBasedRect, Point, Rect} from '~/type'
import {SnapPointData} from '~/main/type'
import {generateBoundingRectFromRect, generateBoundingRectFromRotatedRect} from '~/core/utils'
import render from './render'
import transform, {TransformProps} from '~/elements/rectangle/transform'
import ElementRectangle from '~/elements/rectangle/rectangle'
import {BorderRadius} from '~/elements/props'
import {DEFAULT_BORDER_RADIUS, DEFAULT_HEIGHT, DEFAULT_WIDTH} from '~/elements/defaultProps'
import {isEqual} from '~/lib/lib'

export interface RectangleLikeProps extends ShapeProps {
  id: string
  layer: number
  width?: number
  height?: number
  borderRadius?: BorderRadius
}

export type RequiredRectangleLikeProps = Required<RectangleLikeProps>

class RectangleLike extends Shape {
  id: string
  layer: number
  width: number
  height: number
  borderRadius: BorderRadius

  constructor({
                id,
                layer,
                width = DEFAULT_WIDTH,
                height = DEFAULT_HEIGHT,
                borderRadius = DEFAULT_BORDER_RADIUS,
                ...rest
              }: RectangleLikeProps) {
    super(rest)
    this.id = id
    this.layer = layer
    this.width = width
    this.height = height
    this.borderRadius = borderRadius
  }

  static applyResizeTransform = (arg: TransformProps): Rect => {
    return transform(arg)
  }

  public hitTest(point: Point, borderPadding = 5): 'inside' | 'border' | null {
    const {cx: cx, cy: cy, width, height, rotation = 0} = this
    const rad = rotation * (Math.PI / 180)
    const cos = Math.cos(-rad)
    const sin = Math.sin(-rad)

    const dx = point.x - cx
    const dy = point.y - cy

    // Rotate the point into the rectangle's local coordinate system
    const localX = dx * cos - dy * sin
    const localY = dx * sin + dy * cos

    const halfWidth = width / 2
    const halfHeight = height / 2

    const withinX = localX >= -halfWidth && localX <= halfWidth
    const withinY = localY >= -halfHeight && localY <= halfHeight
    // console.log('hit')

    if (withinX && withinY) {
      const nearLeft = Math.abs(localX + halfWidth) <= borderPadding
      const nearRight = Math.abs(localX - halfWidth) <= borderPadding
      const nearTop = Math.abs(localY + halfHeight) <= borderPadding
      const nearBottom = Math.abs(localY - halfHeight) <= borderPadding

      if (nearLeft || nearRight || nearTop || nearBottom) {
        return 'border'
      }
      return 'inside'
    }

    return null
  }

  override toJSON(): RequiredRectangleLikeProps {
    const {
      borderRadius,
      width,
      height,
      id,
      layer,
    } = this

    return {
      ...super.toJSON(),
      id,
      layer,
      borderRadius: [...borderRadius],
      width,
      height,
    }
  }

  override toMinimalJSON(): RectangleLikeProps {
    const result: RectangleLikeProps = {
      ...super.toMinimalJSON(),
      id: this.id,
      layer: this.layer,
    }

    if (!isEqual(this.borderRadius, DEFAULT_BORDER_RADIUS)) {
      result.borderRadius = [...this.borderRadius]
    }

    if (this.width !== DEFAULT_WIDTH) {
      result.width = this.width
    }

    if (this.height !== DEFAULT_HEIGHT) {
      result.height = this.height
    }

    return result
  }

  public getRect(): CenterBasedRect {
    const {cx, cy, width, height} = this

    return {
      cx,
      cy,
      width,
      height,
    }
  }

  public getBoundingRect() {
    const {cx, cy, width, height, rotation} = this

    const x = cx - width / 2
    const y = cy - height / 2

    if (rotation === 0) {
      return generateBoundingRectFromRect({x, y, width, height})
    }

    return generateBoundingRectFromRotatedRect({x, y, width, height}, rotation)
  }

  public getSelectedBoxModule(lineWidth: number, lineColor: string): ElementRectangle {
    return new ElementRectangle({
      ...this.toJSON(),
      lineColor,
      lineWidth,
      id: this.id + '-selected-box',
      opacity: 0,
    })
  }

  public getHighlightModule(lineWidth: number, lineColor: string): ElementRectangle {
    return new ElementRectangle({
      ...this.toJSON(),
      lineColor,
      lineWidth,
      id: this.id + 'highlight',
      opacity: 0,
    })
  }

  public getOperators(
    id: string,
    resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
  ) {

    return super.getOperators(id, resizeConfig, rotateConfig, this.getBoundingRect(), this.toJSON())
  }

  public getSnapPoints(): SnapPointData[] {
    const {cx: cx, cy: cy, width, height, id} = this
    const halfWidth = width / 2
    const halfHeight = height / 2

    // Define basic snap points: center, corners, and edge centers
    const points: SnapPointData[] = [
      {id, x: cx, y: cy, type: 'center'},
      {id, x: cx - halfWidth, y: cy - halfHeight, type: 'corner-tl'},
      {id, x: cx + halfWidth, y: cy - halfHeight, type: 'corner-tr'},
      {id, x: cx + halfWidth, y: cy + halfHeight, type: 'corner-br'},
      {id, x: cx - halfWidth, y: cy + halfHeight, type: 'corner-bl'},
      {id, x: cx, y: cy - halfHeight, type: 'edge-top'},
      {id, x: cx + halfWidth, y: cy, type: 'edge-right'},
      {id, x: cx, y: cy + halfHeight, type: 'edge-bottom'},
      {id, x: cx - halfWidth, y: cy, type: 'edge-left'},
    ]

    return points
  }

  render(ctx: CanvasRenderingContext2D): void {
    render(this, ctx)
  }
}

export default RectangleLike




