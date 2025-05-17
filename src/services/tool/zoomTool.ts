import ToolManager, {ToolType} from '~/services/tool/toolManager'

export const zoomInTool: ToolType = {
  cursor: 'zoom-in',
  mouseDown(this: ToolManager) {},
  mouseMove(this: ToolManager) {},
  mouseUp(this: ToolManager) {},
}

export const zoomOutTool: ToolType = {
  cursor: 'zoom-out',
  mouseDown(this: ToolManager) {},
  mouseMove(this: ToolManager) {},
  mouseUp(this: ToolManager) { },
}
