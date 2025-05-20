import ElementBase, {ElementBaseProps} from '../base/elementBase'
import {HANDLER_OFFSETS} from '../handleBasics'
import {OperationHandler} from '~/services/selection/type'
import ElementRectangle, {RectangleProps} from '../rectangle/rectangle'
import {BoundingRect, Point} from '~/type'
import {ElementProps} from '../type'
import {rotatePointAroundPoint} from '~/core/geometry'
import {AnchorPoint, Appearance, Fill, Stroke, Transform} from '~/elements/defaultProps'
import {BezierPoint} from '~/elements/props'
import deepClone from '~/core/deepClone'
import {HistoryChangeItem} from '~/services/actions/type'

export interface PathProps extends ElementBaseProps {
  // id: UID,
  // layer: number
  type: 'path'
  points: BezierPoint[];
  closed: boolean;
  // group: string | null;
}

export type RequiredShapeProps = Required<PathProps>

class ElementPath extends ElementBase {
  // readonly id: UID
  // readonly layer: number
  readonly type = 'path'
  private points: BezierPoint[] = []
  closed: boolean
  private original: { points: BezierPoint[], closed: boolean, rotation: number }

  constructor({points = [], closed = false, ...rest}: PathProps) {
    super(rest)
    this.points = deepClone(points)
    this.closed = closed
    // console.log(this.points)
    this.original = {
      closed,
      points: deepClone(points),
      rotation: this.rotation,
    }
    this.updatePath2D()
  }

  static cubicBezier(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point {
    const mt = 1 - t
    const mt2 = mt * mt
    const t2 = t * t

    return {
      x: mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x,
      y: mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y,
    }
  }

  protected updateOriginal() {
    this.original.points = deepClone(this.points)
    this.original.closed = this.closed
    this.updatePath2D()
  }

  get center(): Point {
    const rect = this.getBoundingRect()

    return {
      x: rect.cx,
      y: rect.cy,
    }
  }

  get getPoints(): Point[] {
    return this.points.map(p => ({...p.anchor}))
  }

  protected updatePath2D() {
    this.path2D = new Path2D()

    if (this.points.length === 0) return

    this.path2D.moveTo(this.points[0].anchor.x, this.points[0].anchor.y)

    for (let i = 1; i < this.points.length; i++) {
      const prev = this.points[i - 1]
      const curr = this.points[i]
      const cp1 = prev.cp2 ?? prev.anchor
      const cp2 = curr.cp1 ?? curr.anchor
      this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, curr.anchor.x, curr.anchor.y)
    }

    if (this.closed && this.points.length > 1) {
      const last = this.points[this.points.length - 1]
      const first = this.points[0]
      const cp1 = last.cp2 ?? last.anchor
      const cp2 = first.cp1 ?? first.anchor
      this.path2D.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, first.anchor.x, first.anchor.y)
      this.path2D.closePath()
    }
  }

  translate(dx: number, dy: number): HistoryChangeItem {
    this.points.forEach(p => {
      p.anchor.x += dx
      p.anchor.y += dy
      if (p.cp1) {
        p.cp1.x += dx
        p.cp1.y += dy
      }
      if (p.cp2) {
        p.cp2.x += dx
        p.cp2.y += dy
      }
    })
    this.updatePath2D()

    return {
      id: this.id,
      from: {
        points: deepClone(this.original.points),
      },
      to: {
        points: deepClone(this.points),
      },
    }
  }

  scaleFrom(scaleX: number, scaleY: number, anchor: Point) {
    /*// console.log(scaleX, scaleY, anchor)
    const matrix = new DOMMatrix()
      .translate(anchor.x, anchor.y)
      .scale(scaleX, scaleY)
      .translate(-anchor.x, -anchor.y)

    const {cx, cy, width, height} = this.original
    const topLeft = this.transformPoint(cx - width / 2, cy - height / 2, matrix)
    const bottomRight = this.transformPoint(cx + width / 2, cy + height / 2, matrix)

    this.cx = (topLeft.x + bottomRight.x) / 2
    this.cy = (topLeft.y + bottomRight.y) / 2
    this.width = Math.abs(bottomRight.x - topLeft.x)
    this.height = Math.abs(bottomRight.y - topLeft.y)

    this.updatePath2D()*/
    // console.log(this.cx, this.cy, this.width, this.height)
  }

  public getBoundingRect(): BoundingRect {
    const samplePoints: Point[] = []

    for (let i = 1; i < this.points.length; i++) {
      const prev = this.points[i - 1]
      const curr = this.points[i]

      const p0 = prev.anchor
      const p1 = prev.cp2 ?? prev.anchor
      const p2 = curr.cp1 ?? curr.anchor
      const p3 = curr.anchor

      for (let t = 0; t <= 1; t += 0.05) {
        samplePoints.push(ElementPath.cubicBezier(t, p0, p1, p2, p3))
      }
    }

    if (this.points.length === 1) {
      samplePoints.push(this.points[0].anchor)
    }

    const xs = samplePoints.map(p => p.x)
    const ys = samplePoints.map(p => p.y)

    const left = Math.min(...xs)
    const right = Math.max(...xs)
    const top = Math.min(...ys)
    const bottom = Math.max(...ys)
    const width = right - left
    const height = bottom - top
    const x = left
    const y = top
    const cx = x + width / 2
    const cy = y + height / 2

    return {x, y, width, height, left, right, top, bottom, cx, cy}
  }

  protected toJSON(): RequiredShapeProps {
    return {
      // id: this.id,
      // layer: this.layer,
      type: this.type,
      points: this.points,
      closed: this.closed,
      ...super.toJSON(),
    }
  }

  public toMinimalJSON(): PathProps {
    return {
      // id: this.id,
      // layer: this.layer,
      type: this.type,
      points: this.points,
      closed: this.closed,
      ...super.toMinimalJSON(),
    }
  }

  public getOperators(
    id: string,
    resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    boundingRect: BoundingRect,
    elementOrigin: ElementProps,
  ): OperationHandler[] {
    const {x: cx, y: cy, width, height} = boundingRect
    // const id = this.id
    const {rotation} = this

    const handlers = HANDLER_OFFSETS.map((OFFSET, index): OperationHandler => {
      // Calculate the handle position in local coordinates
      const currentCenterX = cx - width / 2 + OFFSET.x * width
      const currentCenterY = cy - height / 2 + OFFSET.y * height
      const currentElementProps: RectangleProps = {
        id: '',
        layer: 0,
        // width: 0,
        // height: 0,
        // x: currentCenterX,
        // y: currentCenterY,
        // lineColor: '',
        // lineWidth: 0,
        rotation,
      }

      // let cursor: ResizeCursor = OFFSET.cursor as ResizeCursor

      if (OFFSET.type === 'resize') {
        const rotated = rotatePointAroundPoint(currentCenterX, currentCenterY, cx, cy, rotation)
        // cursor = getCursor(rotated.x, rotated.y, cx, cy, rotation)
        currentElementProps.id = index + '-resize'
        currentElementProps.cx = rotated.x
        currentElementProps.cy = rotated.y
        currentElementProps.width = resizeConfig.size
        currentElementProps.height = resizeConfig.size
        currentElementProps.lineWidth = resizeConfig.lineWidth
        currentElementProps.lineColor = resizeConfig.lineColor
        currentElementProps.fillColor = resizeConfig.fillColor
      } else if (OFFSET.type === 'rotate') {
        const currentRotateHandlerCenterX = currentCenterX + OFFSET.offsetX * resizeConfig.lineWidth
        const currentRotateHandlerCenterY = currentCenterY + OFFSET.offsetY * resizeConfig.lineWidth
        const rotated = rotatePointAroundPoint(
          currentRotateHandlerCenterX,
          currentRotateHandlerCenterY,
          cx,
          cy,
          rotation,
        )

        currentElementProps.id = index + '-rotate'
        currentElementProps.cx = rotated.x
        currentElementProps.cy = rotated.y
        currentElementProps.width = rotateConfig.size
        currentElementProps.height = rotateConfig.size
        currentElementProps.lineWidth = rotateConfig.lineWidth
        currentElementProps.lineColor = rotateConfig.lineColor
        currentElementProps.fillColor = rotateConfig.fillColor
      }

      return {
        id: `${id}`,
        type: OFFSET.type,
        name: OFFSET.name,
        // cursor,
        elementOrigin,
        element: new ElementRectangle(currentElementProps),
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

  /*render(ctx: CanvasRenderingContext2D) {

  }*/
}

export default ElementPath