import {BoundingRect} from '~/type'
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
}

export type RequiredBaseProps = Required<ElementBaseProps>

class Base {
  stroke: Stroke
  fill: Fill
  opacity: number
  shadow: Shadow
  rotation: number
  transform: Transform

  constructor({
                stroke = deepClone(DEFAULT_STROKE),
                fill = deepClone(DEFAULT_FILL),
                opacity = deepClone(DEFAULT_OPACITY),
                shadow = deepClone(DEFAULT_SHADOW),
                rotation = deepClone(DEFAULT_ROTATION),
                transform = deepClone(DEFAULT_TRANSFORM),
              }: ElementBaseProps) {
    this.stroke = stroke
    this.fill = fill
    this.opacity = opacity
    this.shadow = shadow
    this.rotation = rotation
    this.transform = transform
  }

  protected toJSON(): RequiredBaseProps {
    const {
      stroke,
      fill,
      opacity,
      shadow,
      rotation,
      transform,
    } = this

    return {
      stroke,
      fill,
      opacity,
      shadow,
      rotation,
      transform,
    }
  }

  protected toMinimalJSON(): ElementBaseProps {
    const result: ElementBaseProps = {}
    if (isEqual(this.stroke, DEFAULT_STROKE)) {
      result.stroke = deepClone(this.stroke)
    }

    if (isEqual(this.fill, DEFAULT_FILL)) {
      result.fill = deepClone(this.fill)
    }

    if (isEqual(this.opacity, DEFAULT_OPACITY)) {
      result.opacity = this.opacity
    }

    if (isEqual(this.shadow, DEFAULT_SHADOW)) {
      result.shadow = deepClone(this.shadow)
    }

    if (isEqual(this.rotation, DEFAULT_ROTATION)) {
      result.rotation = this.rotation
    }

    if (isEqual(this.transform, DEFAULT_TRANSFORM)) {
      result.transform = deepClone(this.transform)
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