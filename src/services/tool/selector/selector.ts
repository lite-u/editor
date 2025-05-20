import ToolManager, {ToolType} from '~/services/tool/toolManager'
import selecting from '~/services/tool/selector/selecting/selecting'
import dragging from '~/services/tool/selector/dragging/dragging'
import resizeTool from '~/services/tool/resize/resizeTool'

const selector: ToolType = {
  cursor: 'default',
  mouseDown: function () {
    const {interaction, elementManager, action, selection, cursor} = this.editor
    const {_hoveredElement, mouseStart, mouseCurrent, _modifier: {shiftKey, metaKey, ctrlKey}} = interaction
    const dragMode = !!_hoveredElement
    const rotateMode = !!interaction._hoveredRotateManipulator
    const resizeMode = !!interaction._hoveredResizeManipulator

    if (resizeMode) {
      const placement = interaction._hoveredResizeManipulator.id.replace('handle-resize-', '')
      console.log(9)
      cursor.set('resize')
      this.subTool = resizeTool

      interaction._resizingData = {placement}
      return
    } else if (rotateMode) {
      interaction._rotateData = {startRotation: 0}

      // this.tool = resizeTool
      //     this.subTool = rotateTool
    }
    if (dragMode) {
      this.subTool = dragging
      const id = _hoveredElement.id

      if (!this.editor.selection.has(id)) {
        action.dispatch('selection-modify', {mode: 'replace', idSet: new Set([_hoveredElement.id])})
      }

      interaction._draggingElements = elementManager.getElementsByIdSet(selection.values)
    } else {
      this.subTool = selecting
      return
    }
  },
  mouseMove(this: ToolManager) {
    const {interaction, cursor} = this.editor

    if (interaction._hoveredResizeManipulator) {
      cursor.set('nw-resize')
      // console.log(10)
    } else if (interaction._hoveredRotateManipulator) {
      cursor.set('rotate')
      // console.log(10)
    } else {
      cursor.set(selector.cursor)
    }

    // if (!this.subTool) return

    this.subTool?.mouseMove.call(this)
  },
  mouseUp(this: ToolManager) {
    if (!this.subTool) return

    this.subTool.mouseUp.call(this)
    this.subTool = null
  },
}

export default selector