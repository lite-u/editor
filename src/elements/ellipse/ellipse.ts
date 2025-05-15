import {generateBoundingRectFromRotatedRect} from '~/core/utils'
import Shape, {ShapeProps} from '../shape/shape'
import ElementRectangle from '../rectangle/rectangle'
import {ResizeHandleName} from '~/services/selection/type'
import {Point} from '~/type'
import render from './render'
import transform from './transform'

export interface EllipseProps extends ShapeProps {
  id: string
  layer: number
  type?: 'ellipse'
  r1: number
  r2: number
}

export type RequiredEllipseProps = Required<EllipseProps>

class ElementEllipse extends Shape {
  readonly type = 'ellipse'
  id: string
  layer: number
  // horizontal
  r1: number
  // vertical
  r2: number
  private original: { cx: number, cy: number, r1: number, r2: number }

  constructor({
                r1,
                r2,
                id,
                layer,
                ...rest
              }: EllipseProps) {
    super(rest)
    this.id = id
    this.layer = layer
    this.r1 = r1!
    this.r2 = r2!
  }

  scale(sx: number, sy: number) {
    this.r1 *= sx
    this.r2 *= sy
  }

  scaleFrom(scaleX: number, scaleY: number, anchor: Point) {
    const matrix = new DOMMatrix()
      .translate(anchor.x, anchor.y)
      .scale(scaleX, scaleY)
      .translate(-anchor.x, -anchor.y)

    const {cx, cy, r1, r2} = this.original
    const topLeft = this.transformPoint(cx - r1, cy - r2 / 2, matrix)
    const bottomRight = this.transformPoint(cx + r1, cy + r2, matrix)

    this.cx = (topLeft.x + bottomRight.x) / 2
    this.cy = (topLeft.y + bottomRight.y) / 2
    this.r1 = Math.abs(bottomRight.x - topLeft.x)
    this.r2 = Math.abs(bottomRight.y - topLeft.y)

    // console.log(this.cx, this.cy, this.width, this.height)
  }

  static applyResizeTransform = (props: {
    downPoint: { x: number; y: number };
    movePoint: { x: number; y: number };
    elementOrigin: RequiredEllipseProps
    rotation: number;
    handleName: ResizeHandleName;
    scale: number;
    dpr: number;
    altKey?: boolean;
    shiftKey?: boolean;
  }): Point & { r1: number, r2: number } => {
    return transform(props)
  }

  public hitTest(point: Point, borderPadding = 5): 'inside' | 'border' | null {
    const {cx: cx, cy: cy, r1, r2, rotation = 0} = this

    const cos = Math.cos(-rotation)
    const sin = Math.sin(-rotation)

    const dx = point.x - cx
    const dy = point.y - cy

    const localX = dx * cos - dy * sin
    const localY = dx * sin + dy * cos

    // Ellipse equation: (x^2 / a^2) + (y^2 / b^2)
    const norm = (localX * localX) / (r1 * r1) + (localY * localY) / (r2 * r2)

    const borderRange = borderPadding / Math.min(r1, r2) // normalized padding

    if (norm <= 1 + borderRange) {
      if (norm >= 1 - borderRange) {
        return 'border'
      }
      return 'inside'
    }

    return null
  }

  public toMinimalJSON(): EllipseProps {
    return {
      ...super.toMinimalJSON(),
      id: this.id,
      type: this.type,
      layer: this.layer,
      r1: this.r1,
      r2: this.r2,
    }
  }

  public toJSON(): RequiredEllipseProps {
    return {
      ...super.toJSON(),
      id: this.id,
      type: this.type,
      layer: this.layer,
      r1: this.r1,
      r2: this.r2,
    }
  }

  public getBoundingRect() {
    const {cx: cx, cy: cy, r1, r2, rotation} = this

    return generateBoundingRectFromRotatedRect({
      x: cx - r1,
      y: cy - r2,
      width: r1 * 2,
      height: r2 * 2,
    }, rotation)
  }

  public getSelectedBoxElement(lineWidth: number, lineColor: string): ElementRectangle {
    // const {id, rotation, layer} = this.toJSON()
    const rect = this.getBoundingRect()
    const rectProp = {
      cx: rect.cx,
      cy: rect.cy,
      width: rect.width,
      height: rect.height,
      lineColor,
      lineWidth,
      rotation: this.rotation,
      layer: this.layer,
      id: this.id + '-selected-box',
      opacity: 0,
    }

    return new ElementRectangle(rectProp)
  }

  public getHighlightElement(lineWidth: number, lineColor: string) {
    const {cx, cy, r1, r2, rotation, layer, id} = this

    return new ElementEllipse({
      cx: cx,
      cy: cy,
      r1,
      r2,
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
    return super.getOperators(id, resizeConfig, rotateConfig, this.getBoundingRect(), this.toMinimalJSON(),
    )
  }

  /*
    public getSnapPoints(): SnapPointData[] {
      const {cx: cx, cy: cy, r1, r2} = this

      // Define snap points: center, cardinal edge points (top, right, bottom, left)
      const points: SnapPointData[] = [
        {id, x: cx, y: cy, type: 'center'},
        {id, x: cx, y: cy - r2, type: 'edge-top'},
        {id, x: cx + r1, y: cy, type: 'edge-right'},
        {id, x: cx, y: cy + r2, type: 'edge-bottom'},
        {id, x: cx - r1, y: cy, type: 'edge-left'},
      ]

      return points
    }*/

  render(ctx: CanvasRenderingContext2D) {
    render.call(this, ctx)
  }
}

export default ElementEllipse