import ToolManager, {SubToolType} from '~/services/tool/toolManager'

const resizeTool: SubToolType = {
  cursor: 'default',
  mouseMove(this: ToolManager) {
    if (!this.subTool) return

    this.subTool.mouseMove.call(this)
  },
  mouseUp(this: ToolManager) {
    if (!this.subTool) return

    this.subTool.mouseUp.call(this)
    this.subTool = null
  },
}

export default resizeTool