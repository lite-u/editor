import ElementBase, {ElementBaseProps} from '../base/elementBase'
import {Point} from '~/type'
import {BezierPoint, Gradient} from '~/elements/props'
import {DEFAULT_CX, DEFAULT_CY, DEFAULT_GRADIENT} from '~/elements/defaultProps'
import {isEqual} from '~/lib/lib'
import deepClone from '~/core/deepClone'
import {HistoryChangeItem} from '~/services/actions/type'

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
  protected original: {
    cx: number;
    cy: number;
    rotation: number,
    points?: BezierPoint[],
    width?: number,
    height?: number,
    r1?: number,
    r2?: number,
    closed?: boolean,
    [key: string]: unknown
  }

  constructor({
                cx = DEFAULT_CX,
                cy = DEFAULT_CY,
                gradient = DEFAULT_GRADIENT,
                ...rest
              }: ShapeProps) {
    super(rest)

    this.cx = cx
    this.cy = cy
    this.original = {
      cx: this.cx,
      cy: this.cy,
      rotation: this.rotation,
    }
    this.gradient = gradient
  }

  translate(dx: number, dy: number, f: boolean): HistoryChangeItem | undefined {
    this.cx = this.cx + dx
    this.cy = this.cy + dy
    this.updatePath2D()

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

  rotateFrom(rotation: number, anchor: Point, f: boolean): HistoryChangeItem | undefined {
    if (rotation !== 0) {
      const matrix = new DOMMatrix()
        .translate(anchor.x, anchor.y)
        .rotate(rotation)
        .translate(-anchor.x, -anchor.y)
// debugger
      const {cx, cy} = this.original
      const transformed = matrix.transformPoint({x: cx, y: cy})
      let newRotation = (this.original.rotation + rotation) % 360
      if (newRotation < 0) newRotation += 360

      this.cx = transformed.x
      this.cy = transformed.y

      this.rotation = newRotation

      this.updatePath2D()
    }

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
}

export default ElementShape