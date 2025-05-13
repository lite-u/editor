import Base, {ElementBaseProps} from '../base/base'
import {HANDLER_OFFSETS} from '../handleBasics'
import {OperationHandlers} from '~/services/selection/type'
import ElementRectangle, {RectangleProps} from '../rectangle/rectangle'
import {BoundingRect} from '~/type'
import {ElementProps} from '../elements'
import {rotatePointAroundPoint} from '~/core/geometry'
import {Gradient} from '~/elements/props'
import {DEFAULT_GRADIENT} from '~/elements/defaultProps'
import {isEqual} from '~/lib/lib'
import deepClone from '~/core/deepClone'

export interface ShapeProps extends ElementBaseProps {
  cx?: number
  cy?: number
  gradient?: Gradient
}

export type RequiredShapeProps = Required<ShapeProps>

const DEFAULT_CX = 0
const DEFAULT_CY = 0

class Shape extends Base {
  public cx: number
  public cy: number
  gradient: Gradient

  constructor({
                cx = DEFAULT_CX,
                cy = DEFAULT_CY,
                gradient = DEFAULT_GRADIENT,
                ...rest
              }: ShapeProps) {
    super(rest)

    this.cx = cx
    this.cy = cy
    this.gradient = gradient
  }

  protected toJSON(): RequiredShapeProps {
    const {
      cx,
      cy,
      gradient,
    } = this

    return {
      ...super.toJSON(),
      cx,
      cy,
      gradient: deepClone(gradient),
    }
  }

  public toMinimalJSON(): ShapeProps {
    const result: ShapeProps = {
      ...super.toMinimalJSON(),
    }

    if (this.cx !== DEFAULT_CX) {
      result.cx = this.cx
    }

    if (this.cy !== DEFAULT_CY) {
      result.cy = this.cy
    }

    if (!isEqual(this.gradient, DEFAULT_GRADIENT)) {
      result.gradient = deepClone(this.gradient)
    }

    return result
  }

  move(x: number, y: number) {
    this.cx += x
    this.cy += y
  }

  public getOperators(
    id: string,
    resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    boundingRect: BoundingRect,
    moduleOrigin: ElementProps,
  ): OperationHandlers[] {
    const {x: cx, y: cy, width, height} = boundingRect
    // const id = this.id
    const {rotation} = this

    const handlers = HANDLER_OFFSETS.map((OFFSET, index): OperationHandlers => {
      // Calculate the handle position in local coordinates
      const currentCenterX = cx - width / 2 + OFFSET.x * width
      const currentCenterY = cy - height / 2 + OFFSET.y * height
      const currentElementProps: RectangleProps = {
        id: '',
        layer: 0,
        // width: 0,
        // height: 0,
        // x: currentCenterX,
        // y: currentCenterY,
        // lineColor: '',
        // lineWidth: 0,
        rotation,
      }

      // let cursor: ResizeCursor = OFFSET.cursor as ResizeCursor

      if (OFFSET.type === 'resize') {
        const rotated = rotatePointAroundPoint(currentCenterX, currentCenterY, cx, cy, rotation)
        // cursor = getCursor(rotated.x, rotated.y, cx, cy, rotation)
        currentElementProps.id = index + '-resize'
        currentElementProps.cx = rotated.x
        currentElementProps.cy = rotated.y
        currentElementProps.width = resizeConfig.size
        currentElementProps.height = resizeConfig.size
        currentElementProps.stroke = {
          weight,
        }
        currentElementProps.stroke.weight = resizeConfig.stroke?.weight
        currentElementProps.lineColor = resizeConfig.lineColor
        currentElementProps.fillColor = resizeConfig.fillColor
      } else if (OFFSET.type === 'rotate') {
        const currentRotateHandlerCenterX = currentCenterX + OFFSET.offsetX * resizeConfig.lineWidth
        const currentRotateHandlerCenterY = currentCenterY + OFFSET.offsetY * resizeConfig.lineWidth
        const rotated = rotatePointAroundPoint(
          currentRotateHandlerCenterX,
          currentRotateHandlerCenterY,
          cx,
          cy,
          rotation,
        )

        currentElementProps.id = index + '-rotate'
        currentElementProps.cx = rotated.x
        currentElementProps.cy = rotated.y
        currentElementProps.width = rotateConfig.size
        currentElementProps.height = rotateConfig.size
        currentElementProps.lineWidth = rotateConfig.lineWidth
        currentElementProps.lineColor = rotateConfig.lineColor
        currentElementProps.fillColor = rotateConfig.fillColor
      }

      return {
        id: `${id}`,
        type: OFFSET.type,
        name: OFFSET.name,
        // cursor,
        moduleOrigin,
        module: new ElementRectangle(currentElementProps),
      }
    })

    return handlers
  }

  public isInsideRect(outer: BoundingRect): boolean {
    const inner = this.getBoundingRect()

    return (
      inner.left >= outer.left &&
      inner.right <= outer.right &&
      inner.top >= outer.top &&
      inner.bottom <= outer.bottom
    )
  }
}

export default Shape