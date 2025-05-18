import ToolManager, {ToolType} from '~/services/tool/toolManager'
import {generateBoundingRectFromTwoPoints} from '~/core/utils'
import selecting from '~/services/tool/selecting/selecting'
import dragTool from '~/services/tool/drag/dragTool'

const selector: ToolType = {
  cursor: 'default',
  mouseDown: function () {
    const {interaction, action, selection, cursor} = this.editor
    const {_hoveredElement, mouseStart, mouseCurrent, _modifier: {shiftKey, metaKey, ctrlKey}} = interaction
    const dragMode = false
    const rotateMode = false
    const resizeMode = false

    if (dragMode) {
      this.tool = dragTool
    } else if (rotateMode) {
      // this.tool = resizeTool

    } else if (resizeMode) {
      // this.tool = resize

    } else {
      this.tool = selecting
      return
    }

    console.log(_hoveredElement)
    const rect = generateBoundingRectFromTwoPoints(
      mouseStart,
      mouseCurrent,
    )

    interaction.updateSelectionBox(rect)

    if (interaction._hoveredElement) {
      action.dispatch('selection-modify', {mode: 'replace', idSet: new Set([interaction._hoveredElement.id])})
    }
  },
  mouseMove(this: ToolManager,) {
    const {interaction, action, selection, cursor} = this.editor
    const {mouseStart, mouseCurrent, _pointDown, _modifier: {shiftKey, metaKey, ctrlKey}} = interaction
    if (!_pointDown) return

    const rect = generateBoundingRectFromTwoPoints(
      mouseStart,
      mouseCurrent,
    )

    interaction.updateSelectionBox(rect)
  },
  mouseUp(this: ToolManager) {
    const {shiftKey, metaKey, ctrlKey} = this.editor.interaction._modifier
    const {interaction, action, selection, cursor} = this.editor
    interaction.hideSelectionBox()

  },
}

export default selector