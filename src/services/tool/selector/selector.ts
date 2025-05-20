import ToolManager, {ToolType} from '~/services/tool/toolManager'
import selecting from '~/services/tool/selector/selecting/selecting'
import dragging from '~/services/tool/selector/dragging/dragging'
import resizing from '~/services/tool/selector/resizing/resizing'

const selector: ToolType = {
  cursor: 'default',
  mouseDown: function () {
    const {interaction, elementManager, action, selection, cursor} = this.editor
    const {_hoveredElement, mouseStart, mouseCurrent, _modifier: {shiftKey, metaKey, ctrlKey}} = interaction
    const dragMode = !!_hoveredElement
    const rotateMode = false
    const resizeMode = false

    interaction._snappedPoint = null
    if (dragMode) {
      this.subTool = dragging
      const id = _hoveredElement.id

      if (!this.editor.selection.has(id)) {
        action.dispatch('selection-modify', {mode: 'replace', idSet: new Set([_hoveredElement.id])})
      }

      interaction._draggingElements = elementManager.getElementsByIdSet(selection.values)
    } else if (rotateMode) {
      // this.tool = resizeTool

    } else if (resizeMode) {
      // this.tool = resize
      this.subTool = resizing

    } else {
      this.subTool = selecting
      return
    }
  },
  mouseMove(this: ToolManager,) {
    if (!this.subTool) return

    this.subTool.mouseMove.call(this)
  },
  mouseUp(this: ToolManager) {
    if (!this.subTool) return

    this.subTool.mouseUp.call(this)
    this.subTool = null
  },
}

export default selector