import {BoundingRect, Point} from '~/type'
import {generateBoundingRectFromTwoPoints} from '~/core/utils'
import {
  DEFAULT_FILL,
  DEFAULT_OPACITY,
  DEFAULT_ROTATION,
  DEFAULT_SHADOW,
  DEFAULT_STROKE,
  DEFAULT_TRANSFORM,
} from '~/elements/defaultProps'
import deepClone from '~/core/deepClone'
import {isEqual} from '~/lib/lib'
import {Fill, Shadow, Stroke, Transform} from '~/elements/props'

export interface ElementBaseProps {
  stroke?: Stroke;
  fill?: Fill;
  opacity?: number;
  shadow?: Shadow
  rotation?: number
  transform?: Transform
  show?: boolean
}

export type RequiredBaseProps = Required<ElementBaseProps>

class ElementBase {
  stroke: Stroke
  fill: Fill
  opacity: number
  shadow: Shadow
  rotation: number
  transform: Transform
  show: boolean
  protected matrix = new DOMMatrix()

  constructor({
                stroke = deepClone(DEFAULT_STROKE),
                fill = deepClone(DEFAULT_FILL),
                opacity = deepClone(DEFAULT_OPACITY),
                shadow = deepClone(DEFAULT_SHADOW),
                rotation = deepClone(DEFAULT_ROTATION),
                transform = deepClone(DEFAULT_TRANSFORM),
                show = true,
              }: ElementBaseProps) {
    this.stroke = stroke
    this.fill = fill
    this.opacity = opacity
    this.shadow = shadow
    this.rotation = rotation
    this.transform = transform
    this.show = show
  }

  protected toJSON(): RequiredBaseProps {
    const {
      show,
      stroke,
      fill,
      opacity,
      shadow,
      rotation,
      transform,
    } = this

    return {
      show,
      stroke: deepClone(stroke),
      fill: deepClone(fill),
      opacity: opacity,
      shadow: deepClone(shadow),
      rotation: rotation,
      transform: deepClone(transform),
    }
  }

  protected toMinimalJSON(): ElementBaseProps {
    const result: ElementBaseProps = {}

    if (!this.show) {
      result.show = false
    }

    if (!isEqual(this.stroke, DEFAULT_STROKE)) {
      result.stroke = deepClone(this.stroke)
    }

    if (!isEqual(this.fill, DEFAULT_FILL)) {
      result.fill = deepClone(this.fill)
    }

    if (!isEqual(this.opacity, DEFAULT_OPACITY)) {
      result.opacity = this.opacity
    }

    if (!isEqual(this.shadow, DEFAULT_SHADOW)) {
      result.shadow = deepClone(this.shadow)
    }

    if (!isEqual(this.rotation, DEFAULT_ROTATION)) {
      result.rotation = this.rotation
    }

    if (!isEqual(this.transform, DEFAULT_TRANSFORM)) {
      result.transform = deepClone(this.transform)
    }

    return result
  }

  protected getBoundingRect(): BoundingRect {
    return generateBoundingRectFromTwoPoints({x: 0, y: 0}, {x: 0, y: 0})
  }

  protected getTransformedPoints(): Point[] {
    return []
  }

  protected getCenter(): Point {
    return {x: 0, y: 0}
  }

  protected resetTransform() {
    this.matrix = new DOMMatrix()
  }

  protected applyTransform(matrix: DOMMatrix): void {
    this.matrix = matrix.multiply(this.matrix)
  }

  protected getTransformMatrix(): DOMMatrix {
    return this.matrix
  }

  protected render(_: CanvasRenderingContext2D): void {
    return undefined
  }
}

export default ElementBase