import {generateBoundingRectFromRect, generateBoundingRectFromRotatedRect} from '~/core/utils'
import {Point, Rect, UID} from '~/type'
import {rotatePointAroundPoint} from '~/core/geometry'
import ElementBase, {ElementBaseProps} from '~/elements/base/elementBase'

export interface EllipseProps extends ElementBaseProps {
  type?: 'ellipse'
  r1: number
  r2: number
  startAngle?: number
  endAngle?: number
}

export type RequiredEllipseProps = Required<EllipseProps>

class ElementEllipse extends ElementBase {
  readonly type = 'ellipse'
  // horizontal
  r1: number
  // vertical
  r2: number
  startAngle = 0
  endAngle = 360

  constructor({
                r1,
                r2,
                startAngle = 0,
                endAngle = 360,
                ...rest
              }: EllipseProps) {
    super(rest)
    this.r1 = r1!
    this.r2 = r2!
    this.startAngle = startAngle
    this.endAngle = endAngle
    this.original = {
      ...this.original,
      r1: this.r1,
      r2: this.r1,
      startAngle: this.startAngle,
      endAngle: this.endAngle,
    }
    this.updatePath2D()
  }

  static create(id: UID, cx: number, cy: number, r1: number = 1, r2?: number): ElementEllipse {
    return new ElementEllipse({id, cx, cy, r1, r2: r2 || r1, layer: 0})
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

  public updatePath2D() {
    this.path2D = new Path2D()
    const rotationRad = (this.rotation * Math.PI) / 180

    const startAngle = ((this.startAngle ?? 0) * Math.PI) / 180
    const endAngle = ((this.endAngle ?? 360) * Math.PI) / 180

    this.path2D.ellipse(this.cx, this.cy, this.r1, this.r2, rotationRad, startAngle, endAngle)

    if (startAngle !== endAngle) {
      this.path2D.lineTo(this.cx, this.cy)
      this.path2D.closePath()
    }
  }

  protected updateOriginal() {
    this.original.cx = this.cx
    this.original.cy = this.cy
    this.original.r1 = this.r1
    this.original.r2 = this.r2
    this.original.rotation = this.rotation
    this.original.startAngle = this.startAngle
    this.original.endAngle = this.endAngle
    this.updatePath2D()
  }

  scaleFrom(scaleX: number, scaleY: number, anchor: Point) {
    const matrix = new DOMMatrix()
      .translate(anchor.x, anchor.y)
      .scale(scaleX, scaleY)
      .translate(-anchor.x, -anchor.y)

    const {cx, cy, r1, r2} = this.original

    const center = ElementBase.transformPoint(cx, cy, matrix)
    const rx = ElementBase.transformPoint(cx + r1!, cy, matrix)
    const ry = ElementBase.transformPoint(cx, cy + r2!, matrix)

    this.cx = center.x
    this.cy = center.y
    this.r1 = Math.abs(rx.x - center.x)
    this.r2 = Math.abs(ry.y - center.y)
    this.updatePath2D()
  }

  public toMinimalJSON(): EllipseProps {
    return {
      ...super.toMinimalJSON(),
      startAngle:this.startAngle,
      endAngle:this.endAngle,
      type: this.type,
      r1: this.r1,
      r2: this.r2,
    }
  }

  public toJSON(): RequiredEllipseProps {
    return {
      ...super.toJSON(),
      startAngle:this.startAngle,
      endAngle:this.endAngle,
      type: this.type,
      r1: this.r1,
      r2: this.r2,
    }
  }

  public getBoundingRect(withoutRotation: boolean = false) {
    const {cx, cy, r1, r2, rotation} = this
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
      x: cx - r1!,
      y: cy - r2!,
      width: r1! * 2,
      height: r2! * 2,
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