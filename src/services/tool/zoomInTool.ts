import ToolManager, {ToolType} from '~/services/tool/toolManager'

let _timer = null

const zoomInTool: ToolType = {
  cursor: 'zoom-in',
  mouseDown(this: ToolManager) {

  },
  mouseMove(this: ToolManager) {},
  mouseUp(this: ToolManager) {},
}

export default zoomInTool