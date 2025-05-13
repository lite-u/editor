import ToolManager, {ToolType} from '~/services/tool/toolManager'

const snapTool: ToolType = {
  cursor: 'rectangle',
  start(this: ToolManager, e: MouseEvent) {

  },
  move(this: ToolManager, e: PointerEvent) {
    // this.editor.interaction._snapped = true
  },
  finish(this: ToolManager, e: MouseEvent) {
  },
}

export default snapTool