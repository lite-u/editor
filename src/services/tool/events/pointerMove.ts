// import Editor from '../../../main/editor'
import ToolManager from '~/services/tool/toolManager'

export default function handlePointerMove(this: ToolManager, e: PointerEvent) {
  const {
    action,
    rect,
    cursor,
    interaction,
    world,
  } = this.editor
  const x = e.clientX - rect!.x
  const y = e.clientY - rect!.y
  const {button, shiftKey, metaKey, ctrlKey, altKey} = e
  const modifiers = {
    button, shiftKey, metaKey, ctrlKey, altKey,
  }
  interaction.mouseCurrent = {x, y}
  interaction.mouseDelta.x = x - interaction.mouseStart.x
  interaction.mouseDelta.y = y - interaction.mouseStart.y
  interaction.mouseWorldCurrent = world.getWorldPointByViewportPoint(x, y)
  interaction.mouseWorldDelta = world.getWorldPointByViewportPoint(x, y)

  cursor.move({x: e.clientX, y: e.clientY})
  action.dispatch('world-mouse-move')
  this.editor.interaction._modifier = modifiers

  this.tool.mouseMove.call(this)
}
