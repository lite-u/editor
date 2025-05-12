// import Editor from '../../../main/editor'
import ToolManager from '~/services/tools/toolManager'

export default function handlePointerMove(this: ToolManager, e: PointerEvent) {
  const {
    action,
    rect,
    interaction,
  } = this.editor
  interaction.mouseMovePoint.x = e.clientX - rect!.x
  interaction.mouseMovePoint.y = e.clientY - rect!.y
  // interaction.drawCrossLine = false

  action.dispatch('world-mouse-move')
  let tool = this.toolMap.get(this.currentToolName)!

  tool.move.call(this, e)
}
