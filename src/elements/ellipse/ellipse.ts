import {generateBoundingRectFromRotatedRect} from '~/core/utils'
import ElementShape, {ShapeProps} from '../shape/shape'
import ElementRectangle from '../rectangle/rectangle'
import {Point} from '~/type'
import render from './render'
import {rotatePointAroundPoint} from '~/core/geometry'
import {HistoryChangeItem} from '~/services/actions/type'

export interface EllipseProps extends ShapeProps {
  id: string
  layer: number
  type?: 'ellipse'
  r1: number
  r2: number
}

export type RequiredEllipseProps = Required<EllipseProps>

class ElementEllipse extends ElementShape {
  readonly type = 'ellipse'
  id: string
  layer: number
  // horizontal
  r1: number
  // vertical
  r2: number
  private original: { cx: number, cy: number, r1: number, r2: number, rotation: number }

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

    console.log(super.original)
/*    this.original = {
      ...this.original,
      cx: this.cx,
      cy: this.cy,
      r1: this.r1,
      r2: this.r1,
      rotation: this.rotation,
    }*/
    this.updatePath2D()
  }

  get getPoints(): Point[] {
    const {cx, cy, r1, r2, rotation} = this

    // Points before rotation
    const top = rotatePointAroundPoint(cx, cy - r2, cx, cy, rotation)
    const bottom = rotatePointAroundPoint(cx, cy + r2, cx, cy, rotation)
    const left = rotatePointAroundPoint(cx - r1, cy, cx, cy, rotation)
    const right = rotatePointAroundPoint(cx + r1, cy, cx, cy, rotation)

    return [top, right, bottom, left]
  }

  protected updatePath2D() {
    this.path2D = new Path2D()
    this.path2D.ellipse(this.cx, this.cy, this.r1, this.r2, this.rotation, 0, Math.PI * 2)
  }

  protected updateOriginal() {
    this.original.cx = this.cx
    this.original.cy = this.cy
    this.original.r1 = this.r1
    this.original.r2 = this.r2
    this.original.rotation = this.rotation
    this.updatePath2D()
  }
/*
  translate(dx: number, dy: number): HistoryChangeItem {
    this.cx = this.original.cx + dx
    this.cy = this.original.cy + dy
    this.updatePath2D()

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
  }*/

  scaleFrom(scaleX: number, scaleY: number, anchor: Point) {
    const matrix = new DOMMatrix()
      .translate(anchor.x, anchor.y)
      .scale(scaleX, scaleY)
      .translate(-anchor.x, -anchor.y)

    const {cx, cy, r1, r2} = this.original

    const center = this.transformPoint(cx, cy, matrix)
    const rx = this.transformPoint(cx + r1, cy, matrix)
    const ry = this.transformPoint(cx, cy + r2, matrix)

    this.cx = center.x
    this.cy = center.y
    this.r1 = Math.abs(rx.x - center.x)
    this.r2 = Math.abs(ry.y - center.y)
    this.updatePath2D()
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

  public getBoundingRectFromOriginal() {
    const {cx: cx, cy: cy, r1, r2, rotation} = this.original

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