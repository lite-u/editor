import Editor from '../../../main/editor'
import ToolManager from '~/services/tool/toolManager'

function handleMouseUp(this: ToolManager, e: MouseEvent) {
  let tool = this.toolMap.get(this.currentToolName)!

  tool.finish.call(this, e)
}

export default handleMouseUp
