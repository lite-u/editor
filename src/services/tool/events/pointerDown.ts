import ToolManager from '~/services/tool/toolManager'
import snapTool from '~/services/tool/snap/snap'

function handleMouseDown(this: ToolManager, e: PointerEvent) {
  const {button, target, shiftKey, metaKey, ctrlKey, altKey, clientX, clientY, movementX, movementY} = e

  if (target !== this.editor.container) return
  const modifiers = {
    shiftKey, metaKey, ctrlKey, altKey, button, movementX, movementY,
  }
  const x = clientX - this.editor.rect!.x
  const y = clientY - this.editor.rect!.y
  const {interaction, world} = this.editor

  interaction.mouseStart = {x, y}
  interaction.mouseCurrent = {x, y}
  interaction.mouseWorldStart = world.getWorldPointByViewportPoint(x, y)
  interaction.mouseWorldCurrent = world.getWorldPointByViewportPoint(x, y)

  // console.log(operator)
  this.editor.container.setPointerCapture(e.pointerId)
  this.editor.interaction._modifier = modifiers
  e.preventDefault()
  if (button !== 0) return

  snapTool.mouseDown.call(this)
  this.tool.mouseDown.call(this)
}

export default handleMouseDown
