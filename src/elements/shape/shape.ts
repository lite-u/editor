import Base, {ElementBaseProps} from '../base/base'
import {HANDLER_OFFSETS} from '../handleBasics'
import {OperationHandlers} from '~/services/selection/type'
import {rotatePoint} from '~/core/lib'
import ElementRectangle, {RectangleProps} from '../rectangle/rectangle'
import {ElementFillColor} from '~/core/core'
import {BoundingRect} from '~/type'
import {ElementProps} from '../elements'

export interface ShapeProps extends ElementBaseProps {
  cx?: number
  cy?: number
  enableGradient?: boolean
  gradient?: string
  enableFill?: boolean
  fillColor?: ElementFillColor
  dashLine?: string
}

export type RequiredShapeProps = Required<ShapeProps>

const DEFAULT_CX = 0
const DEFAULT_CY = 0
const DEFAULT_ENABLE_GRADIENT = false
const DEFAULT_GRADIENT = ''
const DEFAULT_ENABLE_FILL = true
const DEFAULT_FILL_COLOR = '#fff'
const DEFAULT_DASH_LINE = ''

class Shape extends Base {
  public cx: number
  public cy: number
  readonly fillColor: ElementFillColor
  readonly enableFill: boolean
  enableGradient: boolean
  gradient: string
  dashLine: string

  constructor({
                cx = DEFAULT_CX,
                cy = DEFAULT_CY,
                enableGradient = DEFAULT_ENABLE_GRADIENT,
                gradient = DEFAULT_GRADIENT,
                enableFill = DEFAULT_ENABLE_FILL,
                fillColor = DEFAULT_FILL_COLOR,
                dashLine = DEFAULT_DASH_LINE,
                ...rest
              }: ShapeProps) {
    super(rest)

    this.cx = cx
    this.cy = cy
    this.fillColor = fillColor
    this.enableFill = enableFill
    this.enableGradient = enableGradient
    this.gradient = gradient
    this.dashLine = dashLine
  }

  protected toJSON(): RequiredShapeProps {
    const {
      cx,
      cy,
      fillColor,
      enableFill,
      enableGradient,
      gradient,
      dashLine,
    } = this

    return {
      ...super.toJSON(),
      cx,
      cy,
      fillColor,
      enableFill,
      enableGradient,
      gradient,
      dashLine,

    }
  }

  public toMinimalJSON(): ShapeProps {
    const result: ShapeProps = {
      ...super.toMinimalJSON(),
    }

    if (this.cx === DEFAULT_CX) {
      result.cx = this.cx
    }

    if (this.cy === DEFAULT_CY) {
      result.cy = this.cy
    }

    if (this.enableGradient === DEFAULT_ENABLE_GRADIENT) {
      result.enableGradient = this.enableGradient
    }

    if (this.gradient === DEFAULT_GRADIENT) {
      result.gradient = this.gradient
    }

    if (this.enableFill === DEFAULT_ENABLE_FILL) {
      result.enableFill = this.enableFill
    }

    if (this.fillColor === DEFAULT_FILL_COLOR) {
      result.fillColor = this.fillColor
    }

    if (this.dashLine === DEFAULT_DASH_LINE) {
      result.dashLine = this.dashLine
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
      const currentModuleProps: RectangleProps = {
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
        const rotated = rotatePoint(currentCenterX, currentCenterY, cx, cy, rotation)
        // cursor = getCursor(rotated.x, rotated.y, cx, cy, rotation)
        currentModuleProps.id = index + '-resize'
        currentModuleProps.cx = rotated.x
        currentModuleProps.cy = rotated.y
        currentModuleProps.width = resizeConfig.size
        currentModuleProps.height = resizeConfig.size
        currentModuleProps.lineWidth = resizeConfig.lineWidth
        currentModuleProps.lineColor = resizeConfig.lineColor
        currentModuleProps.fillColor = resizeConfig.fillColor
      } else if (OFFSET.type === 'rotate') {
        const currentRotateHandlerCenterX = currentCenterX + OFFSET.offsetX * resizeConfig.lineWidth
        const currentRotateHandlerCenterY = currentCenterY + OFFSET.offsetY * resizeConfig.lineWidth
        const rotated = rotatePoint(
          currentRotateHandlerCenterX,
          currentRotateHandlerCenterY,
          cx,
          cy,
          rotation,
        )

        currentModuleProps.id = index + '-rotate'
        currentModuleProps.cx = rotated.x
        currentModuleProps.cy = rotated.y
        currentModuleProps.width = rotateConfig.size
        currentModuleProps.height = rotateConfig.size
        currentModuleProps.lineWidth = rotateConfig.lineWidth
        currentModuleProps.lineColor = rotateConfig.lineColor
        currentModuleProps.fillColor = rotateConfig.fillColor
      }

      return {
        id: `${id}`,
        type: OFFSET.type,
        name: OFFSET.name,
        // cursor,
        moduleOrigin,
        module: new ElementRectangle(currentModuleProps),
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