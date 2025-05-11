import Editor from '../../../main/editor'
import ToolManager from '~/services/tools/toolManager'

export default function handlePointerMove(this: ToolManager, e: PointerEvent) {
  const {
    action,
    viewport,
  } = this
  viewport.mouseMovePoint.x = e.clientX - viewport.rect!.x
  viewport.mouseMovePoint.y = e.clientY - viewport.rect!.y
  viewport.drawCrossLine = false

  action.dispatch('world-mouse-move')
  let tool = this.toolMap.get(this.currentToolName)!

  tool.move.call(this, e)
}
