import Shape, {ShapeCreationProps} from '../shape/shape'
// import {ResizeHandleName} from '~/engine/selection/type'
import {CenterBasedRect, Point, Rect} from '~/type'
import {ModuleInstance} from '../elements'
import {SnapPointData} from '~/engine/type'
// import {getResizeTransform} from '~/core/lib'
import {generateBoundingRectFromRect, generateBoundingRectFromRotatedRect} from '~/core/utils'
import renderer from './renderer'
import transform, {TransformProps} from '~/elements/rectangle/transform'

export interface RectangleProps extends ShapeCreationProps {
  id: string
  layer: number
  width?: number
  height?: number
  radius?: number
}

export type RequiredRectangleProps = Required<RectangleProps>
export type TypedRectangleProps = RectangleProps & {
  type?: 'rectangle'

}

const DEFAULT_WIDTH = 10
const DEFAULT_HEIGHT = 10
const DEFAULT_RADIUS = 0

class Rectangle extends Shape {
  // readonly type = 'rectangle'
  id: string
  layer: number
  width: number
  height: number
  radius: number

  constructor({
                id,
                layer,
                width = DEFAULT_WIDTH,
                height = DEFAULT_HEIGHT,
                radius = DEFAULT_RADIUS,
                ...rest
              }: RectangleProps) {
    super(rest)
    this.id = id
    this.layer = layer
    this.width = width
    this.height = height
    this.radius = radius
  }

  get type(): 'rectangle' {
    return 'rectangle'
  }

  static applyResizeTransform = (arg: TransformProps): Rect => {
    return transform(arg)
  }

  public hitTest(point: Point, borderPadding = 5): 'inside' | 'border' | null {
    const {x: cx, y: cy, width, height, rotation = 0} = this
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

  public toJSON(): RequiredRectangleProps {
    const {
      radius,
      width,
      height,
      id,
      layer,
    } = this

    return {
      ...super.toJSON(),
      type: this.type,
      id,
      layer,
      radius,
      width,
      height,
    }

  }

  public toMinimalJSON(): RectangleProps {
    const result: RectangleProps = {
      ...super.toMinimalJSON(),
      type: 'rectangle',
      id: this.id,
      layer: this.layer,
    }

    if (this.radius !== DEFAULT_RADIUS) {
      result.radius = this.radius
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
    const {x, y, width, height} = this

    return {
      x,
      y,
      width,
      height,
    }
  }

  public getBoundingRect() {
    const {x: cx, y: cy, width, height, rotation} = this

    const x = cx - width / 2
    const y = cy - height / 2

    if (rotation === 0) {
      return generateBoundingRectFromRect({x, y, width, height})
      /*return {
        x,
        y,
        width,
        height,
        left: x,
        top: y,
        right: x + width,
        bottom: y + height,
        cx,
        cy,
      }*/
    }

    return generateBoundingRectFromRotatedRect({x, y, width, height}, rotation)
  }

  public getSelectedBoxModule(lineWidth: number, lineColor: string): Rectangle {
    const {id, rotation, layer} = this

    const rectProp = {
      ...this.getRect(),
      lineColor,
      lineWidth,
      rotation,
      layer,
      id: id + '-selected-box',
      opacity: 0,
    }

    return new Rectangle(rectProp)
  }

  public getHighlightModule(lineWidth: number, lineColor: string): ModuleInstance {
    const {x, y, width, height, rotation, layer, id} = this
    return new Rectangle({
      x,
      y,
      width,
      height,
      // fillColor,
      lineColor,
      lineWidth,
      rotation,
      layer,
      id: id + 'highlight',
      opacity: 0,
    })
  }

  public getOperators(
    id: string,
    resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
  ) {

    return super.getOperators(id, resizeConfig, rotateConfig, this.getRect(), this.toJSON())
  }

  public getSnapPoints(): SnapPointData[] {
    const {x: cx, y: cy, width, height, id} = this
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
    renderer(this, ctx)
  }
}

export default Rectangle




