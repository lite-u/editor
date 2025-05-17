import ToolManager, {ToolType} from '~/services/tool/toolManager'

const zoomOutTool: ToolType = {
  cursor: 'zoom-out',
  mouseDown(this: ToolManager) {},
  mouseMove(this: ToolManager) {},
  mouseUp(this: ToolManager) { },
}

export default zoomOutTool