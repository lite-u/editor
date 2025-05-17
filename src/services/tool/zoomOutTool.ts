import ToolManager, {ToolType} from '~/services/tool/toolManager'

const zoomOutTool: ToolType = {
  cursor: 'zoom-out',
  mouseDown(this: ToolManager) {
    this.editor.cursor.set('grabbing')
    // updateCursor.call(this, 'grabbing')
  },
  mouseMove(this: ToolManager) {},
  mouseUp(this: ToolManager) {
    this.editor.cursor.set('grab')
  },
}

export default zoomOutTool