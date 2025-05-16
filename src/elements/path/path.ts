import ElementBase, {ElementBaseProps} from '../base/elementBase'
import {HANDLER_OFFSETS} from '../handleBasics'
import {OperationHandler} from '~/services/selection/type'
import ElementRectangle, {RectangleProps} from '../rectangle/rectangle'
import {BoundingRect} from '~/type'
import {ElementProps} from '../type'
import {rotatePointAroundPoint} from '~/core/geometry'
import {AnchorPoint, Appearance, Fill, Stroke, Transform} from '~/elements/defaultProps'
import {BasePath} from '~/elements/basePath/basePath'
import {BezierPoint} from '~/elements/props'
import deepClone from '~/core/deepClone'

export interface PathProps extends ElementBaseProps {
  type: 'path'
  points: BezierPoint[];
  closed: boolean;
  layer: string;
  group: string | null;
}

export type RequiredShapeProps = Required<PathProps>

class Path extends ElementBase implements BasePath {
  readonly type = 'path'
  private points: BezierPoint[] = []

  constructor({points = [], ...rest}: PathProps) {
    super(rest)
    this.points = deepClone(points)
  }

  protected toJSON(): RequiredShapeProps {
    return {
      ...super.toJSON(),
    }
  }

  public toMinimalJSON(): PathProps {
    const result: PathProps = {
      ...super.toMinimalJSON(),
    }

    return result
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
}

export default BasePath