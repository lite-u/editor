import ToolManager, {ToolType} from '~/services/tool/toolManager'

const snapTool: ToolType = {
  cursor: 'rectangle',
  mouseDown(this: ToolManager, e: MouseEvent) {

  },
  mouseMove(this: ToolManager, e: PointerEvent) {
    // this.editor.interaction._snapped = true
  },
  mouseUp(this: ToolManager, e: MouseEvent) {
  },
}

export default snapTool