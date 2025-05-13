import ToolManager from '~/services/tool/toolManager'
import {RotateHandle} from '~/services/selection/type'

export function applyRotating(this: ToolManager, shiftKey: boolean) {
  const {interaction, world} = this.editor
  const {mouseStart, mouseNow, _rotatingOperator} = interaction
  const {scale, dpr, offset} = world
  const {element: {rotation}, elementOrigin} = _rotatingOperator as RotateHandle
  const {x, y} = elementOrigin

  const startX = (mouseStart.x - offset.x / dpr) / scale * dpr
  const startY = (mouseStart.y - offset.y / dpr) / scale * dpr
  const currentX = (mouseNow.x - offset.x / dpr) / scale * dpr
  const currentY = (mouseNow.y - offset.y / dpr) / scale * dpr

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