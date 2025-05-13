// import Editor from '../../../main/editor'
import ToolManager from '~/services/tool/toolManager'

export default function handlePointerMove(this: ToolManager, e: PointerEvent) {
  const {
    action,
    rect,
    interaction,
    world,
  } = this.editor
  const x = e.clientX - rect!.x
  const y = e.clientY - rect!.y

  interaction.mouseCurrent = {x, y}
  interaction.mouseDelta.x = x - interaction.mouseStart.x
  interaction.mouseDelta.y = y - interaction.mouseStart.y
  interaction.mouseWorldCurrent = world.getWorldPointByViewportPoint(x, y)
  interaction.mouseWorldDelta = world.getWorldPointByViewportPoint(x, y)
  // interaction.drawCrossLine = false

  // cursor.move({x, y})
  action.dispatch('world-mouse-move')
  // let tool = this.tool
  // console.log(tool)
  this.tool.move.call(this, e)
}
