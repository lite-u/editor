import ToolManager from '~/services/tool/toolManager'

function handleMouseUp(this: ToolManager, e: PointerEvent) {
  this.tool.mouseUp.call(this)
  this.editor.container.releasePointerCapture(e.pointerId)
  this.editor.interaction._pointDown = false
  this.editor.action.dispatch('clear-creation')
}

export default handleMouseUp
