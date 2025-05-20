import ElementShape, {ShapeProps} from '../shape/shape'
import {Point} from '~/type'
import {SnapPointData} from '~/main/type'
import {generateBoundingRectFromRect, generateBoundingRectFromRotatedRect} from '~/core/utils'
import ElementRectangle from '~/elements/rectangle/rectangle'
import {BorderRadius} from '~/elements/props'
import {DEFAULT_BORDER_RADIUS, DEFAULT_HEIGHT, DEFAULT_WIDTH} from '~/elements/defaultProps'
import {isEqual} from '~/lib/lib'
import {HistoryChangeItem} from '~/services/actions/type'

export interface RectangleLikeProps extends ShapeProps {
  id: string
  layer: number
  width?: number
  height?: number
  borderRadius?: BorderRadius
}

export type RequiredRectangleLikeProps = Required<RectangleLikeProps>

class RectangleLike extends ElementShape {
  // id: string
  // layer: number
  width: number
  height: number
  borderRadius: BorderRadius
  // path2D: Path2D = new Path2D()
  // private original: { cx: number, cy: number, width: number, height: number, rotation: number }

  constructor({
                // id,
                // layer,
                width = DEFAULT_WIDTH,
                height = DEFAULT_HEIGHT,
                borderRadius = DEFAULT_BORDER_RADIUS,
                ...rest
              }: RectangleLikeProps) {
    super(rest)

    // this.id = id
    // this.layer = layer
    this.width = width
    this.height = height
    this.borderRadius = borderRadius
    this.original = {
      ...this.original,
      width,
      height,
    }
    this.updatePath2D()
  }

  protected updatePath2D() {
    const {cx, cy, borderRadius, rotation} = this
    const [tl, tr, br, bl] = borderRadius
    const {top, right, bottom, left} = this.getBoundingRect(true)
    const matrix = new DOMMatrix()
      .translate(cx, cy)
      .rotate(rotation)
      .translate(-cx, -cy)

    const topLeft = matrix.transformPoint({x: left, y: top})
    const topRight = matrix.transformPoint({x: right, y: top})
    const bottomRight = matrix.transformPoint({x: right, y: bottom})
    const bottomLeft = matrix.transformPoint({x: left, y: bottom})

    this.path2D = new Path2D()
    this.path2D.moveTo(topLeft.x + tl, topLeft.y)

    if (tr > 0) {
      this.path2D.arcTo(topRight.x, topRight.y, bottomRight.x, bottomRight.y, tr)
    } else {
      this.path2D.lineTo(topRight.x, topRight.y)
    }

    if (br > 0) {
      this.path2D.arcTo(bottomRight.x, bottomRight.y, bottomLeft.x, bottomLeft.y, br)
    } else {
      this.path2D.lineTo(bottomRight.x, bottomRight.y)
    }

    if (bl > 0) {
      this.path2D.arcTo(bottomLeft.x, bottomLeft.y, topLeft.x, topLeft.y, bl)
    } else {
      this.path2D.lineTo(bottomLeft.x, bottomLeft.y)
    }

    if (tl > 0) {
      this.path2D.arcTo(topLeft.x, topLeft.y, topRight.x, topRight.y, tl)
    } else {
      this.path2D.lineTo(topLeft.x, topLeft.y)
    }

    this.path2D.closePath()
  }

  protected updateOriginal() {
    this.original.cx = this.cx
    this.original.cy = this.cy
    this.original.width = this.width
    this.original.height = this.height
    this.original.rotation = this.rotation
    this.updatePath2D()
  }

  protected get getPoints(): Point[] {
    const w = this.width / 2
    const h = this.height / 2

    return [
      {x: this.cx - w, y: this.cy - h}, // top-left
      {x: this.cx + w, y: this.cy - h}, // top-right
      {x: this.cx + w, y: this.cy + h}, // bottom-right
      {x: this.cx - w, y: this.cy + h},  // bottom-left
    ]
  }

  protected get corners(): Point[] {
    const w = this.width / 2
    const h = this.height / 2

    return [
      {x: this.cx - w, y: this.cy - h}, // top-left
      {x: this.cx + w, y: this.cy - h}, // top-right
      {x: this.cx + w, y: this.cy + h}, // bottom-right
      {x: this.cx - w, y: this.cy + h},  // bottom-left
    ]
  }

  /*
    applyMatrix(matrix: DOMMatrix) {
      const points = this.corners.map(p => {
        const r = matrix.transformPoint(p)
        return {x: r.x, y: r.y}
      })

      // Recalculate x, y, width, height from transformed corners
      const xs = points.map(p => p.x)
      const ys = points.map(p => p.y)
      this.x = Math.min(...xs)
      this.y = Math.min(...ys)
      this.width = Math.max(...xs) - this.x
      this.height = Math.max(...ys) - this.y
    }
  */

  /*  rotate(angle: number, center?: Point) {
      this.rotation = angle
    }*/

  /*  translate(dx: number, dy: number): HistoryChangeItem {
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

  rotateFrom(rotation: number, anchor: Point): RectangleLike {
    const matrix = new DOMMatrix()
      .translate(anchor.x, anchor.y)
      .rotate(rotation)
      .translate(-anchor.x, -anchor.y)

    const {cx, cy} = this.original
    const transformed = matrix.transformPoint({x: cx, y: cy})

    this.cx = transformed.x
    this.cy = transformed.y
    this.rotation = this.original.rotation + rotation

    this.updatePath2D()

    // return this
  }

  scaleFrom(scaleX: number, scaleY: number, anchor: Point): HistoryChangeItem | undefined {
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

    this.updatePath2D()
  }

  override toJSON(): RequiredRectangleLikeProps {
    const {
      borderRadius,
      width,
      height,
      // id,
      // layer,
    } = this
    if (!borderRadius) {
      debugger

    }
    return {
      ...super.toJSON(),
      // id,
      // layer,
      borderRadius: [...borderRadius],
      width,
      height,
    }
  }

  override toMinimalJSON(): RectangleLikeProps {
    const result: RectangleLikeProps = {
      ...super.toMinimalJSON(),
      // id: this.id,
      // layer: this.layer,
    }

    if (!isEqual(this.borderRadius, DEFAULT_BORDER_RADIUS)) {
      result.borderRadius = [...this.borderRadius]
    }

    if (this.width !== DEFAULT_WIDTH) {
      result.width = this.width
    }

    if (this.height !== DEFAULT_HEIGHT) {
      result.height = this.height
    }

    return result
  }

  public getBoundingRect(withoutRotation: boolean = false) {
    const {cx, cy, width, height, rotation} = this

    const x = cx - width / 2
    const y = cy - height / 2

    if (rotation === 0 || withoutRotation) {
      return generateBoundingRectFromRect({x, y, width, height})
    }

    return generateBoundingRectFromRotatedRect({x, y, width, height}, rotation)
  }

  public getBoundingRectFromOriginal() {
    const {cx, cy, width, height, rotation} = this.original

    const x = cx - width / 2
    const y = cy - height / 2

    if (rotation === 0) {
      return generateBoundingRectFromRect({x, y, width, height})
    }

    return generateBoundingRectFromRotatedRect({x, y, width, height}, rotation)
  }

  public getSelectedBoxElement(lineWidth: number, lineColor: string): ElementRectangle {
    return new ElementRectangle({
      ...this.toJSON(),
      lineColor,
      lineWidth,
      id: this.id + '-selected-box',
      opacity: 0,
    })
  }

  public getHighlightElement(lineWidth: number, lineColor: string): ElementRectangle {
    return new ElementRectangle({
      ...this.toJSON(),
      lineColor,
      lineWidth,
      id: this.id + 'highlight',
      opacity: 0,
    })
  }

  /*  public getOperators(
      id: string,
      resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
      rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    ) {

      return super.getOperators(id, resizeConfig, rotateConfig, this.getBoundingRect(), this.toJSON())
    }*/

  public getSnapPoints(): SnapPointData[] {
    const {cx: cx, cy: cy, width, height, id} = this
    const halfWidth = width / 2
    const halfHeight = height / 2

    // Define basic snap points: center, corners, and edge centers
    const points: SnapPointData[] = [
      {id, x: cx, y: cy, type: 'center'},
      {id, x: cx - halfWidth, y: cy - halfHeight, type: 'corner-tl'},
      {id, x: cx + halfWidth, y: cy - halfHeight, type: 'corner-tr'},
      {id, x: cx + halfWidth, y: cy + halfHeight, type: 'corner-br'},
      {id, x: cx - halfWidth, y: cy + halfHeight, type: 'corner-bl'},
      {id, x: cx, y: cy - halfHeight, type: 'edge-top'},
      {id, x: cx + halfWidth, y: cy, type: 'edge-right'},
      {id, x: cx, y: cy + halfHeight, type: 'edge-bottom'},
      {id, x: cx - halfWidth, y: cy, type: 'edge-left'},
    ]

    return points
  }
}

export default RectangleLike


