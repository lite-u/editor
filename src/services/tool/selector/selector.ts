import ToolManager, {ToolType} from '~/services/tool/toolManager'
import selecting from '~/services/tool/selector/selecting/selecting'
import dragging from '~/services/tool/selector/dragging/dragging'
import resizing from '~/services/tool/selector/resizing/resizing'
import rotating from '~/services/tool/selector/rotating/rotating'
import {getBoundingRectFromBoundingRects} from '~/services/tool/resize/helper'

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
      cursor.set('resize')
      this.subTool = resizing

      interaction._resizingData = {placement}

      cursor.set('resize')
      this.subTool = resizing
    } else if (rotateMode) {
      const rects = elementManager.getElementsByIdSet(selection.values).map(ele => {
        return ele.getBoundingRect(true)
      })
      const center = getBoundingRectFromBoundingRects(rects)
      const {cx: x, cy: y} = center
      interaction._rotateData = {startRotation: interaction._outlineElement.rotation, targetPoint: {x, y}}
      this.subTool = rotating
    } else if (dragMode) {
      this.subTool = dragging
      const id = _hoveredElement.id

      if (!this.editor.selection.has(id)) {
        action.dispatch('selection-modify', {mode: 'replace', idSet: new Set([_hoveredElement.id])})
      }

      interaction._draggingElements = elementManager.getElementsByIdSet(selection.values)
    } else {
      this.subTool = selecting
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

    this.editor.interaction._rotateData = null
    this.subTool.mouseUp.call(this)
    this.subTool = null
  },
}

export default selector