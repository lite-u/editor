import ToolManager from '~/services/tool/toolManager'
import {ElementInstance} from '~/elements/type'
import {ResizeHandleName} from '~/services/selection/type'

function resizeTool(this: ToolManager, elements: ElementInstance[], direction: ResizeHandleName = 'br') {
  const {interaction, action} = this.editor
  const {mouseWorldCurrent, _modifier, mouseWorldStart} = interaction
  const {altKey, shiftKey} = _modifier
  let minX = Number.MAX_SAFE_INTEGER
  let minY = Number.MAX_SAFE_INTEGER
  let maxX = Number.MIN_SAFE_INTEGER
  let maxY = Number.MIN_SAFE_INTEGER
  let centerX: number
  let centerY: number
  const anchor = {
    x: Number.MAX_SAFE_INTEGER,
    y: Number.MAX_SAFE_INTEGER,
  }

  elements.forEach((el: ElementInstance) => {
    const rect = el.getBoundingRect()
    minX = Math.min(anchor.x, rect.x)
    minY = Math.min(anchor.y, rect.y)
    maxX = Math.max(anchor.x, rect.x)
    maxY = Math.max(anchor.y, rect.y)
  })

  centerX = (maxX - minX) / 2
  centerY = (maxY - minY) / 2
  anchor.x = minX
  anchor.y = minY

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