import {HANDLER_OFFSETS} from '~/elements/handleBasics'
import {OperationHandler} from '~/services/selection/type'
import ElementRectangle, {RectangleProps} from '~/elements/rectangle/rectangle'
import {rotatePointAroundPoint} from '~/core/geometry'
import {DEFAULT_FILL, DEFAULT_STROKE} from '~/elements/defaultProps'
import {ElementInstance} from '~/elements/elements'
import {EllipseProps} from '~/elements/ellipse/ellipse'

export const generateHandles = (element: ElementInstance, ratio: number) => {
  const {id, x: ox, y: oy, rotation} = element.toJSON()
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
    const currentCenterX = ox - width / 2 + OFFSET.x * width
    const currentCenterY = oy - height / 2 + OFFSET.y * height

    const handleElementProps: RectangleProps = {
      id: `${id}-${OFFSET.type}-${index}`,
      layer: 0,
      rotation,
    }

    // let cursor: ResizeCursor = OFFSET.cursor as ResizeCursor

    if (OFFSET.type === 'resize') {
      const rotated = rotatePointAroundPoint(currentCenterX, currentCenterY, ox, oy, rotation)

      handleElementProps.cx = rotated.x
      handleElementProps.cy = rotated.y
      handleElementProps.width = resizeConfig.size
      handleElementProps.height = resizeConfig.size
      handleElementProps.stroke = {
        ...DEFAULT_STROKE,
        weight: resizeConfig.lineWidth,
      }
      // currentElementProps.stroke.weight = resizeConfig.stroke?.weight
      // currentElementProps.lineColor = resizeConfig.lineColor
      // currentElementProps.fillColor = resizeConfig.fillColor
    } else if (OFFSET.type === 'rotate') {
      const currentRotateHandlerCX = currentCenterX + OFFSET.offsetX * resizeConfig.lineWidth
      const currentRotateHandlerCY = currentCenterY + OFFSET.offsetY * resizeConfig.lineWidth
      const rotated = rotatePointAroundPoint(
        currentRotateHandlerCX,
        currentRotateHandlerCY,
        ox,
        oy,
        rotation,
      )

      // handleElementProps.id = index + '-rotate'
      handleElementProps.cx = rotated.x
      handleElementProps.cy = rotated.y
      handleElementProps.width = rotateConfig.size
      handleElementProps.height = rotateConfig.size
      handleElementProps.lineWidth = rotateConfig.lineWidth
      handleElementProps.lineColor = rotateConfig.lineColor
      handleElementProps.fillColor = rotateConfig.fillColor
    }

    return {
      id: `${id}`,
      type: OFFSET.type,
      name: OFFSET.name,
      // cursor,
      elementOrigin,
      element: new ElementRectangle(handleElementProps),
    }
  })
}