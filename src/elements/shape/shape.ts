import ElementBase, {ElementBaseProps} from '../base/elementBase'
import {HANDLER_OFFSETS} from '../handleBasics'
import {OperationHandler} from '~/services/selection/type'
import ElementRectangle, {RectangleProps} from '../rectangle/rectangle'
import {BoundingRect, Point} from '~/type'
import {ElementProps} from '../type'
import {rotatePointAroundPoint} from '~/core/geometry'
import {Gradient} from '~/elements/props'
import {DEFAULT_CX, DEFAULT_CY, DEFAULT_GRADIENT, DEFAULT_STROKE} from '~/elements/defaultProps'
import {isEqual} from '~/lib/lib'
import deepClone from '~/core/deepClone'

export interface ShapeProps extends ElementBaseProps {
  cx?: number
  cy?: number
  gradient?: Gradient
}

export type RequiredShapeProps = Required<ShapeProps>

class ElementShape extends ElementBase {
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

  protected get center(): Point {
    return {x: this.cx, y: this.cy}
  }

  translate(dx: number, dy: number) {
    this.cx = this.original.cx + dx
    this.cy = this.original.cx + dy
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
    // boundingRect: BoundingRect,
    elementOrigin: ElementProps,
  ): OperationHandler[] {
    const boundingRect = this.getBoundingRect()
    const {x: cx, y: cy, width, height} = boundingRect
    const {rotation} = this

    return HANDLER_OFFSETS.map((OFFSET, index): OperationHandler => {
      // Calculate the handle position in local coordinates
      const currentCenterX = cx - width / 2 + OFFSET.x * width
      const currentCenterY = cy - height / 2 + OFFSET.y * height

      const handleElementProps: RectangleProps = {
        id: `${id}-${OFFSET.type}-${index}`,
        layer: 0,
        rotation,
      }

      // let cursor: ResizeCursor = OFFSET.cursor as ResizeCursor

      if (OFFSET.type === 'resize') {
        const rotated = rotatePointAroundPoint(currentCenterX, currentCenterY, cx, cy, rotation)

        handleElementProps.cx = rotated.x
        handleElementProps.cy = rotated.y
        handleElementProps.width = resizeConfig.size
        handleElementProps.height = resizeConfig.size
        handleElementProps.stroke = {
          ...DEFAULT_STROKE,
          weight: resizeConfig.lineWidth,
        }
        // currentElementProps.stroke.weight = resizeConfig.stroke?.weight
        // currentElementProps.lineColor = resizeConfig.lineColor
        // currentElementProps.fillColor = resizeConfig.fillColor
      } else if (OFFSET.type === 'rotate') {
        const currentRotateHandlerCX = currentCenterX + OFFSET.offsetX * resizeConfig.lineWidth
        const currentRotateHandlerCY = currentCenterY + OFFSET.offsetY * resizeConfig.lineWidth
        const rotated = rotatePointAroundPoint(
          currentRotateHandlerCX,
          currentRotateHandlerCY,
          cx,
          cy,
          rotation,
        )

        // handleElementProps.id = index + '-rotate'
        handleElementProps.cx = rotated.x
        handleElementProps.cy = rotated.y
        handleElementProps.width = rotateConfig.size
        handleElementProps.height = rotateConfig.size
        handleElementProps.lineWidth = rotateConfig.lineWidth
        handleElementProps.lineColor = rotateConfig.lineColor
        handleElementProps.fillColor = rotateConfig.fillColor
      }

      return {
        id: `${id}`,
        type: OFFSET.type,
        name: OFFSET.name,
        // cursor,
        elementOrigin,
        element: new ElementRectangle(handleElementProps),
      }
    })
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

export default ElementShape