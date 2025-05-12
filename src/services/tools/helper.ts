import ToolManager from '~/services/tools/toolManager'
import {RotateHandler} from '~/services/selection/type'

export function applyRotating(this: ToolManager, shiftKey: boolean) {
  const {interaction, world} = this.editor
  const {mouseDownPoint, mouseMovePoint, _rotatingOperator} = interaction
  const {scale, dpr, offset} = world
  const {module: {rotation}, moduleOrigin} = _rotatingOperator as RotateHandler
  const {x, y} = moduleOrigin

  const startX = (mouseDownPoint.x - offset.x / dpr) / scale * dpr
  const startY = (mouseDownPoint.y - offset.y / dpr) / scale * dpr
  const currentX = (mouseMovePoint.x - offset.x / dpr) / scale * dpr
  const currentY = (mouseMovePoint.y - offset.y / dpr) / scale * dpr

  const startAngle = Math.atan2(startY - y, startX - x)
  const currentAngle = Math.atan2(currentY - y, currentX - x)

  let rotationDelta = (currentAngle - startAngle) * (180 / Math.PI)

  if (shiftKey) {
    rotationDelta = Math.round(rotationDelta / 15) * 15
  }

  let newRotation = (rotation + rotationDelta) % 360
  if (newRotation < 0) newRotation += 360

  return newRotation
}