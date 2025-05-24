import {BoundingRect, ElementProps, Point, UID} from '~/type'
import {generateBoundingRectFromTwoPoints} from '~/core/utils'
import {
  DEFAULT_CX,
  DEFAULT_CY,
  DEFAULT_FILL,
  DEFAULT_GRADIENT,
  DEFAULT_OPACITY,
  DEFAULT_ROTATION,
  DEFAULT_SHADOW,
  DEFAULT_STROKE,
  DEFAULT_TRANSFORM,
} from '~/elements/defaultProps'
import deepClone from '~/core/deepClone'
import {isEqual} from '~/lib/lib'
import {BezierPoint, Fill, Gradient, Shadow, Stroke, Transform} from '~/elements/props'
import {HistoryChangeItem} from '~/services/actions/type'

type ElementEventHandler<T = any> = (payload: T) => void;

interface ElementEventMap {
  move: { dx: number; dy: number };
  translate: { dx: number; dy: number };
  resize: { scaleX: number; scaleY: number };
  rotate: { angle: number };

  [key: string]: any; // For extensibility
}

export interface ElementBaseProps {
  id: UID,
  layer: number
  stroke?: Stroke;
  fill?: Fill;
  opacity?: number;
  shadow?: Shadow
  rotation?: number
  transform?: Transform
  show?: boolean
  cx?: number
  cy?: number
  gradient?: Gradient
}

export type RequiredBaseProps = Required<ElementBaseProps>

class ElementBase {
  id: UID
  layer: number
  cx: number
  cy: number
  gradient: Gradient
  stroke: Stroke
  fill: Fill
  opacity: number
  shadow: Shadow
  rotation: number
  transform: Transform
  show: boolean
  // protected matrix = new DOMMatrix()
  path2D = new Path2D()
  protected original: {
    cx: number;
    cy: number;
    rotation: number,
    points?: BezierPoint[],
    start?: Point,
    end?: Point,
    width?: number,
    height?: number,
    r1?: number,
    r2?: number,
    closed?: boolean,
    [key: string]: unknown
  }
  // public _relatedId: string
  protected eventListeners: {
    [K in keyof ElementEventMap]?: ElementEventHandler<ElementEventMap[K]>[]
  } = {}

  constructor({
                id,
                layer,
                cx = DEFAULT_CX,
                cy = DEFAULT_CY,
                gradient = DEFAULT_GRADIENT,
                stroke = deepClone(DEFAULT_STROKE),
                fill = deepClone(DEFAULT_FILL),
                opacity = deepClone(DEFAULT_OPACITY),
                shadow = deepClone(DEFAULT_SHADOW),
                rotation = deepClone(DEFAULT_ROTATION),
                transform = deepClone(DEFAULT_TRANSFORM),
                show = true,
              }: ElementBaseProps) {
    this.id = id
    this.layer = layer
    this.cx = cx
    this.cy = cy
    this.stroke = stroke
    this.fill = fill
    this.opacity = opacity
    this.shadow = shadow
    this.rotation = rotation
    this.transform = transform
    this.show = show
    this.gradient = gradient

    this.original = {
      cx: this.cx,
      cy: this.cy,
      rotation: this.rotation,
    }
  }

  static transformPoint(x: number, y: number, matrix: DOMMatrix): Point {
    // if(!matrix) debugger
    const p = matrix.transformPoint({x, y})
    return {x: p.x, y: p.y}
  }

  on<K extends keyof ElementEventMap>(
    event: K,
    handler: ElementEventHandler<ElementEventMap[K]>,
  ) {
    if (!this.eventListeners[event]) this.eventListeners[event] = []
    this.eventListeners[event]!.push(handler)
  }

  dispatchEvent(eventData: { type: string; [key: string]: any }) {
/*    if(eventData.type ==='mouseenter'){
      debugger
    }*/
    const handlers = this.eventListeners[eventData.type as keyof ElementEventMap]
    if (!handlers) return

    for (const handler of handlers) {
      handler(eventData)
      if (eventData.isPropagationStopped) break
    }
  }

  public translate(dx: number, dy: number, f: boolean = false): HistoryChangeItem | undefined {
    this.cx = this.cx + dx
    this.cy = this.cy + dy
    this.updatePath2D()

    this.eventListeners['move']?.forEach(handler => handler({dx, dy}))

    if (f) {
      return {
        id: this.id,
        from: {
          cx: this.original.cx,
          cy: this.original.cy,
        },
        to: {
          cx: this.cx,
          cy: this.cy,
        },
      }
    }
  }

  /* Invoke updateOriginal method when you do accept the element's current state as static state */
  protected updateOriginal() {}

  protected rotate(angle: number) {
    this.rotation = angle
    this.updatePath2D()
  }

  protected rotateFrom(rotation: number, anchor: Point, f: boolean): HistoryChangeItem | undefined {
    // if (rotation !== 0) {
    const matrix = new DOMMatrix()
      .translate(anchor.x, anchor.y)
      .rotate(rotation)
      .translate(-anchor.x, -anchor.y)
    const {cx, cy} = this.original
    const transformed = matrix.transformPoint({x: cx, y: cy})
    let newRotation = (this.original.rotation + rotation) % 360

    if (newRotation < 0) newRotation += 360

    this.rotation = newRotation
    this.cx = transformed.x
    this.cy = transformed.y

    this.updatePath2D()
    // }

    if (f) {
      return {
        id: this.id,
        from: {
          cx: this.original.cx,
          cy: this.original.cy,
          rotation: this.original.rotation,
        },
        to: {
          cx: this.cx,
          cy: this.cy,
          rotation: this.rotation,
        },
      }
    }
  }

  protected get center(): Point {
    return {x: this.cx, y: this.cy}
  }

  protected toJSON(): RequiredBaseProps {
    const {
      id,
      cx,
      cy,
      rotation,
      layer,
      show,
      stroke,
      fill,
      opacity,
      shadow,
      gradient,
      transform,
    } = this

    return {
      id,
      layer,
      show,
      cx,
      cy,
      gradient: deepClone(gradient),
      stroke: deepClone(stroke),
      fill: deepClone(fill),
      opacity: opacity,
      shadow: deepClone(shadow),
      rotation: rotation,
      transform: deepClone(transform),
    }
  }

  protected toMinimalJSON(): ElementBaseProps {
    const result: ElementBaseProps = {id: this.id, layer: this.layer}

    if (!this.show) {
      result.show = false
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

  protected updatePath2D() { }

  protected restore(props: Partial<ElementProps>) {
    Object.assign(this, props)
    Object.assign(this.original, props)

    this.updatePath2D()
  }

  protected getTransformedPoints(): Point[] {
    return []
  }

  protected getCenter(): Point {
    return {x: 0, y: 0}
  }

  /*protected resetTransform() {
    this.matrix = new DOMMatrix()
  }*/

  /*  protected applyTransform(matrix: DOMMatrix): void {
      this.matrix = matrix.multiply(this.matrix)
    }*/

  /*  protected getTransformMatrix(): DOMMatrix {
      return this.matrix
    }*/

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.path2D) return

    // if(this.id ==='hello3')debugger
    let {show, opacity, fill, stroke} = this
    const {enabled: enabledFill, color: fillColor} = fill
    const {enabled: enabledStroke, color: strokeColor, weight, join, cap /*dashed*/} = stroke

    if (!show || opacity <= 0) return

    ctx.save()

    if (opacity < 100) {
      ctx.globalAlpha = opacity / 100
    }

    if (enabledFill) {
      ctx.fillStyle = fillColor
      ctx.fill(this.path2D)
    }

    if (enabledStroke && weight > 0) {
      ctx.lineWidth = weight
      // console.log(weight,strokeColor)
      ctx.strokeStyle = strokeColor
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.stroke(this.path2D)
    }

    ctx.restore()
  }
}

export default ElementBase