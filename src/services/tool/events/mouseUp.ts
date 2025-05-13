import ToolManager from '~/services/tool/toolManager'

function handleMouseUp(this: ToolManager, e: MouseEvent) {
  this.tool.finish.call(this, e)
}

export default handleMouseUp
