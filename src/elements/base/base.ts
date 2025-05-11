import {RotateHandler} from '~/services/selection/type'
import {Rotation} from '~/core/core'
import {BoundingRect} from '~/type'
import Editor from '~/main/editor'
import {generateBoundingRectFromTwoPoints} from '~/core/utils'

export interface ElementBaseProps {
  enableLine?: boolean
  lineColor?: CanvasRenderingContext2D['strokeStyle']
  lineWidth?: CanvasRenderingContext2D['lineWidth']
  opacity?: CanvasRenderingContext2D['globalAlpha']
  enableShadow?: boolean
  shadow?: string
  rotation?: number
}

export type RequiredBaseProps = Required<ElementBaseProps>

const DEFAULT_ENABLE_LINE = true
const DEFAULT_LINE_COLOR = '#000'
const DEFAULT_LINE_WIDTH = 1
const DEFAULT_OPACITY = 100
const DEFAULT_ROTATION = 0
const DEFAULT_ENABLE_SHADOW = false
const DEFAULT_SHADOW = ''

class Base {
  public rotation: Rotation
  protected enableLine: boolean
  protected lineWidth: CanvasRenderingContext2D['lineWidth']
  protected lineColor: CanvasRenderingContext2D['strokeStyle']
  protected opacity: CanvasRenderingContext2D['globalAlpha']
  protected enableShadow: boolean
  protected shadow: string

  constructor({
                enableLine = DEFAULT_ENABLE_LINE,
                lineColor = DEFAULT_LINE_COLOR,
                lineWidth = DEFAULT_LINE_WIDTH,
                opacity = DEFAULT_OPACITY,
                rotation = DEFAULT_ROTATION,
                enableShadow = DEFAULT_ENABLE_SHADOW,
                shadow = DEFAULT_SHADOW,
              }: ElementBaseProps) {
    this.enableLine = enableLine
    this.lineColor = lineColor
    this.lineWidth = lineWidth
    this.opacity = opacity
    this.rotation = rotation
    this.enableShadow = enableShadow
    this.shadow = shadow
  }

  static applyRotating(this: Editor, shiftKey: boolean) {
    const {mouseDownPoint, mouseMovePoint, scale, dpr, offset} = this.viewport
    const {module: {rotation}, moduleOrigin} = this._rotatingOperator as RotateHandler
    const {x, y} = moduleOrigin

    const startX = (mouseDownPoint.x - offset.x / dpr) / scale * dpr
    const startY = (mouseDownPoint.y - offset.y / dpr) / scale * dpr
    const currentX = (mouseMovePoint.x - offset.x / dpr) / scale * dpr
    const currentY = (mouseMovePoint.y - offset.y / dpr) / scale * dpr

    const startAngle = Math.atan2(startY - y, startX - x)
    const currentAngle = Math.atan2(currentY - y, currentX - x)

    let rotationDelta = (currentAngle - startAngle) * (180 / Math.PI)

    if (shiftKey) {
      rotationDelta = Math.round(rotationDelta / 15) * 15
    }

    let newRotation = (rotation + rotationDelta) % 360
    if (newRotation < 0) newRotation += 360

    return newRotation
  }

  protected toJSON(): RequiredBaseProps {
    const {
      enableLine,
      lineColor,
      lineWidth,
      opacity,
      enableShadow,
      shadow,
      rotation,
    } = this

    return {
      enableLine,
      lineColor,
      lineWidth,
      opacity,
      enableShadow,
      shadow,
      rotation,
    }
  }

  protected toMinimalJSON(): ElementBaseProps {
    const result: ElementBaseProps = {}

    if (this.enableLine !== DEFAULT_ENABLE_LINE) {
      result.enableLine = this.enableLine
    }

    if (this.lineColor !== DEFAULT_LINE_COLOR) {
      result.lineColor = this.lineColor
    }

    if (this.lineWidth !== DEFAULT_LINE_WIDTH) {
      result.lineWidth = this.lineWidth
    }

    if (this.opacity !== DEFAULT_OPACITY) {
      result.opacity = this.opacity
    }

    if (this.enableShadow !== DEFAULT_ENABLE_SHADOW) {
      result.enableShadow = this.enableShadow
    }

    if (this.shadow !== DEFAULT_SHADOW) {
      result.shadow = this.shadow
    }

    if (this.rotation !== DEFAULT_ROTATION) {
      result.rotation = this.rotation
    }

    return result
  }

  protected getBoundingRect(): BoundingRect {
    return generateBoundingRectFromTwoPoints({x: 0, y: 0}, {x: 0, y: 0})
  }

  protected render(_ctx: CanvasRenderingContext2D): void {
    return undefined
  }
}

export default Base