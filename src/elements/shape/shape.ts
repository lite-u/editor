import Base, {ElementBaseProps} from '../base/base'
import {HANDLER_OFFSETS} from '../handleBasics'
import {OperationHandlers} from '~/engine/selection/type'
import {rotatePoint} from '~/core/lib'
import Rectangle, {RectangleProps} from '../rectangle/rectangle'
import {ElementFillColor} from '~/core/core'
import {CenterBasedRect} from '~/type'
import {ModuleProps} from '../elements'

export interface ElementShapeProps extends ElementBaseProps {
  x?: number
  y?: number
  enableGradient?: boolean
  gradient?: string
  enableFill?: boolean
  fillColor?: ElementFillColor
  dashLine?: string
}

const DEFAULT_X = 0
const DEFAULT_Y = 0
const DEFAULT_ENABLE_GRADIENT = false
const DEFAULT_GRADIENT = ''
const DEFAULT_ENABLE_FILL = true
const DEFAULT_FILL_COLOR = '#fff'
const DEFAULT_DASH_LINE = ''

class Shape extends Base {
  public x: number
  public y: number
  readonly fillColor: ElementFillColor
  readonly enableFill: boolean
  enableGradient?: boolean
  gradient?: string
  dashLine?: string

  constructor({
                x = DEFAULT_X,
                y = DEFAULT_Y,
                enableGradient = DEFAULT_ENABLE_GRADIENT,
                gradient = DEFAULT_GRADIENT,
                enableFill = DEFAULT_ENABLE_FILL,
                fillColor = DEFAULT_FILL_COLOR,
                dashLine = DEFAULT_DASH_LINE,
                ...rest
              }: ElementShapeProps) {
    super(rest)

    this.x = x
    this.y = y
    this.fillColor = fillColor as ElementFillColor
    this.enableFill = enableFill
    this.enableGradient = enableGradient
    this.gradient = gradient
    this.dashLine = dashLine
  }

  public toJSON(): ElementShapeProps {
    const result: ElementShapeProps = {
      ...super.toJSON(),
    }

    if (this.x === DEFAULT_X) {
      result.x = this.x
    }

    if (this.y === DEFAULT_Y) {
      result.y = this.y
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
    this.x += x
    this.y += y
  }

  public getOperators(
    resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    boundingRect: CenterBasedRect,
    moduleOrigin: ModuleProps,
  ): OperationHandlers[] {
    const {x: cx, y: cy, width, height} = boundingRect
    // const id = this.id
    const {id, rotation} = this

    const handlers = HANDLER_OFFSETS.map((OFFSET): OperationHandlers => {
      // Calculate the handle position in local coordinates
      const currentCenterX = cx - width / 2 + OFFSET.x * width
      const currentCenterY = cy - height / 2 + OFFSET.y * height
      const currentModuleProps: Omit<RectangleProps, 'type'> = {
        id,
        width: 0,
        height: 0,
        x: currentCenterX,
        y: currentCenterY,
        lineColor: '',
        lineWidth: 0,
        rotation,
        layer: this.layer,
        opacity: 100,
      }

      // let cursor: ResizeCursor = OFFSET.cursor as ResizeCursor

      if (OFFSET.type === 'resize') {
        const rotated = rotatePoint(currentCenterX, currentCenterY, cx, cy, rotation)
        // cursor = getCursor(rotated.x, rotated.y, cx, cy, rotation)
        currentModuleProps.id += 'resize'
        currentModuleProps.x = rotated.x
        currentModuleProps.y = rotated.y
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

        currentModuleProps.id += 'rotate'
        currentModuleProps.x = rotated.x
        currentModuleProps.y = rotated.y
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
        module: new Rectangle(currentModuleProps),
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