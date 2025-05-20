import {generateBoundingRectFromRect, generateBoundingRectFromRotatedRect} from '~/core/utils'
import ElementShape, {ShapeProps} from '../shape/shape'
import {Point, Rect} from '~/type'
import {rotatePointAroundPoint} from '~/core/geometry'

export interface EllipseProps extends ShapeProps {
  // id: string
  // layer: number
  type?: 'ellipse'
  r1: number
  r2: number
}

export type RequiredEllipseProps = Required<EllipseProps>

class ElementEllipse extends ElementShape {
  readonly type = 'ellipse'
  // horizontal
  r1: number
  // vertical
  r2: number

  constructor({
                r1,
                r2,
                ...rest
              }: EllipseProps) {
    super(rest)
    this.r1 = r1!
    this.r2 = r2!

    this.original = {
      ...this.original,
      r1: this.r1,
      r2: this.r1,
    }
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
    this.path2D.closePath()
  }

  protected updateOriginal() {
    this.original.cx = this.cx
    this.original.cy = this.cy
    this.original.r1 = this.r1
    this.original.r2 = this.r2
    this.original.rotation = this.rotation
    this.updatePath2D()
  }

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
      type: this.type,
      r1: this.r1,
      r2: this.r2,
    }
  }

  public toJSON(): RequiredEllipseProps {
    return {
      ...super.toJSON(),
      type: this.type,
      r1: this.r1,
      r2: this.r2,
    }
  }

  public getBoundingRect(withoutRotation: boolean = false) {
    const {cx: cx, cy: cy, r1, r2, rotation} = this
    const rect: Rect = {
      x: cx - r1,
      y: cy - r2,
      width: r1 * 2,
      height: r2 * 2,
    }

    if (rotation === 0 || withoutRotation) {
      return generateBoundingRectFromRect(rect)
    }

    return generateBoundingRectFromRotatedRect(rect, rotation)
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

  /*
    public getOperators(
      id: string,
      resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
      rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    ) {
      return super.getOperators(id, resizeConfig, rotateConfig, this.getBoundingRect(), this.toMinimalJSON(),
      )
    }
  */

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

  /*  render(ctx: CanvasRenderingContext2D) {
      render.call(this, ctx)
    }*/
}

export default ElementEllipse