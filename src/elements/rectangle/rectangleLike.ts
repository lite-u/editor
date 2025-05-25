import {Point} from '~/type'
import {generateBoundingRectFromRect, generateBoundingRectFromRotatedRect} from '~/core/utils'
import {BorderRadius} from '~/elements/props'
import {DEFAULT_BORDER_RADIUS, DEFAULT_HEIGHT, DEFAULT_WIDTH} from '~/elements/defaultProps'
import {isEqual} from '~/lib/lib'
import {HistoryChangeItem} from '~/services/actions/type'
import ElementBase, {ElementBaseProps} from '~/elements/base/elementBase'

export interface RectangleLikeProps extends ElementBaseProps {
  id: string
  layer: number
  width?: number
  height?: number
  borderRadius?: BorderRadius
}

export type RequiredRectangleLikeProps = Required<RectangleLikeProps>

class RectangleLike extends ElementBase {
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
    this.updateBoundingRect()
    // this.updateTransform()
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

  updateOriginal() {
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

  scaleFrom(scaleX: number, scaleY: number, anchor: Point): HistoryChangeItem | undefined {
    const {cx, cy, width, height, rotation} = this.original

    console.log(scaleX, scaleY)
    const matrix = new DOMMatrix()
      .rotate(-rotation)
      // .scale(scaleX, scaleY, 1, anchor.x, anchor.y)
      .scale(scaleX, scaleY)
    // .rotate(rotation)
    const halfW = width / 2
    const halfH = height / 2

    const topLeft = {x: cx - halfW, y: cy - halfH}
    const topRight = {x: cx + halfW, y: cy - halfH}
    const bottomRight = {x: cx + halfW, y: cy + halfH}
    const bottomLeft = {x: cx - halfW, y: cy + halfH}

    // Transform all four corners
    const pTL = matrix.transformPoint(topLeft)
    const pTR = matrix.transformPoint(topRight)
    const pBR = matrix.transformPoint(bottomRight)
    const pBL = matrix.transformPoint(bottomLeft)
    console.log('topLeft', topLeft, pTL)

    // New center is average of opposite corners (or all four)
    const newCX = (pTL.x + pBR.x) / 2
    const newCY = (pTL.y + pBR.y) / 2

    const newWidth = Math.hypot(pTR.x - pTL.x, pTR.y - pTL.y)
    const newHeight = Math.hypot(pBL.x - pTL.x, pBL.y - pTL.y)

    this.cx = newCX
    this.cy = newCY
    this.width = newWidth
    this.height = newHeight
    this.updatePath2D()

    return {}
  }

  toJSON(): RequiredRectangleLikeProps {
    const {
      borderRadius,
      width,
      height,
    } = this
    if (!borderRadius) {
      debugger

    }
    return {
      ...super.toJSON(),
      borderRadius: [...borderRadius],
      width,
      height,
    }
  }

  toMinimalJSON(): RectangleLikeProps {
    const result: RectangleLikeProps = {
      ...super.toMinimalJSON(),
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
}

export default RectangleLike

