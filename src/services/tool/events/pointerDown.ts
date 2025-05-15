import ToolManager from '~/services/tool/toolManager'
import snapTool from '~/services/tool/snap/snap'

function handleMouseDown(this: ToolManager, e: PointerEvent) {
  const {clientY, target, button, clientX} = e
  if (target !== this.editor.container) return

  const x = clientX - this.editor.rect!.x
  const y = clientY - this.editor.rect!.y
  const {interaction, world} = this.editor

  interaction.mouseStart = {x, y}
  interaction.mouseCurrent = {x, y}
  interaction.mouseWorldStart = world.getWorldPointByViewportPoint(x, y)
  interaction.mouseWorldCurrent = world.getWorldPointByViewportPoint(x, y)

  // console.log(operator)
  this.editor.container.setPointerCapture(e.pointerId)
  e.preventDefault()
  if (button !== 0) return
  /*

    if (this.editor.interaction.spaceKeyDown) {
      return (this.editor.interaction.state = 'panning')
    }
  */

  snapTool.mouseDown.call(this, e)
  this.tool.mouseDown.call(this, e)
}

export default handleMouseDown
