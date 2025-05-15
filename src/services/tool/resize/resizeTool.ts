import ToolManager from '~/services/tool/toolManager'
import {ElementInstance} from '~/elements/type'
import {ResizeDirectionName} from '~/services/selection/type'
import {getAnchorByResizeDirection, getBoundingRectFromBoundingRects} from '~/services/tool/resize/helper'

function resizeTool(this: ToolManager, elements: ElementInstance[], direction: ResizeDirectionName = 'br') {
  const {interaction, action} = this.editor
  const {mouseWorldCurrent, _modifier, mouseWorldStart} = interaction
  const {altKey, shiftKey} = _modifier
  const rect = getBoundingRectFromBoundingRects(elements.map(el => el.getBoundingRectFromOriginal()))
  const anchor = getAnchorByResizeDirection(rect, direction)

  const centerX = rect.cx
  const centerY = rect.cy

  const startVec = {
    x: mouseWorldStart.x - anchor.x,
    y: mouseWorldStart.y - anchor.y,
  }
  const currentVec = {
    x: mouseWorldCurrent.x - anchor.x,
    y: mouseWorldCurrent.y - anchor.y,
  }

  let scaleX = startVec.x !== 0 ? currentVec.x / startVec.x : 1
  let scaleY = startVec.y !== 0 ? currentVec.y / startVec.y : 1

  if (shiftKey) {
    const uniformScale = Math.max(Math.abs(scaleX), Math.abs(scaleY))
    scaleX = Math.sign(scaleX) * uniformScale
    scaleY = Math.sign(scaleY) * uniformScale
  }

  const scalingAnchor = altKey
    ? {x: centerX, y: centerY}
    : anchor

  elements.forEach((el: ElementInstance) => {
    el.scaleFrom(scaleX, scaleY, scalingAnchor)
  })

  action.dispatch('visible-element-updated')
}

export default resizeTool