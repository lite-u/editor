import {HANDLER_OFFSETS} from '~/elements/handleBasics'
import {OperationHandler} from '~/services/selection/type'
import ElementRectangle, {RectangleProps} from '~/elements/rectangle/rectangle'
import {rotatePointAroundPoint} from '~/core/geometry'
import {DEFAULT_FILL, DEFAULT_STROKE} from '~/elements/defaultProps'
import {ElementInstance} from '~/elements/type'
import {EllipseProps} from '~/elements/ellipse/ellipse'

export const generateHandles = (element: ElementInstance, ratio: number): OperationHandler[] => {
  const elementData = element.toJSON()
  const {id, x: ox, y: oy, rotation} = elementData
  const {width, height} = element.getBoundingRect()
  // const {rotation} = this
  const lineWidth = 1 / ratio
  const resizeSize = 10 / ratio
  const rotateSize = 15 / ratio
  const lineColor = '#5491f8'
  const resizeConfig: Partial<RectangleProps> = {
    width: resizeSize,
    height: resizeSize,
    fill: {...DEFAULT_FILL, color: '#ffffff', enabled: false},
    stroke: {...DEFAULT_STROKE, weight: lineWidth, color: lineColor},
  }

  const rotateConfig: Partial<EllipseProps> = {
    r1: rotateSize,
    r2: rotateSize,
    fill: {...DEFAULT_FILL, enabled: false},
    stroke: {...DEFAULT_STROKE, enabled: false},
  }

  return HANDLER_OFFSETS.map((OFFSET, index): OperationHandler => {
    // Calculate the handle position in local coordinates
    const cx = ox - width / 2 + OFFSET.x * width
    const cy = oy - height / 2 + OFFSET.y * height

    const basicProps: RectangleProps = {
      id: `${id}-${OFFSET.type}-${index}`,
      layer: 0,
      rotation,
    }

    if (OFFSET.type === 'resize') {
      const rotated = rotatePointAroundPoint(cx, cy, ox, oy, rotation)

      basicProps.cx = rotated.x
      basicProps.cy = rotated.y

      Object.assign(basicProps, resizeConfig)
    } else {
      const currentRotateHandlerCX = cx + OFFSET.offsetX * lineWidth
      const currentRotateHandlerCY = cy + OFFSET.offsetY * lineWidth
      const rotated = rotatePointAroundPoint(
        currentRotateHandlerCX,
        currentRotateHandlerCY,
        ox,
        oy,
        rotation,
      )

      basicProps.cx = rotated.x
      basicProps.cy = rotated.y
      Object.assign(basicProps, rotateConfig)
    }

    return {
      id: `${id}`,
      type: OFFSET.type,
      name: OFFSET.name,
      // cursor,
      elementOrigin: elementData,
      element: new ElementRectangle(basicProps),
    }
  })
}