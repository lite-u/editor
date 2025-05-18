import ToolManager, {ToolType} from '~/services/tool/toolManager'
import {generateBoundingRectFromTwoPoints} from '~/core/utils'
import selector from '~/services/tool/selector/selector'

const selecting: ToolType = {
  cursor: 'default',
  mouseDown: function () { },
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
    /*const {shiftKey, metaKey, ctrlKey} = this.editor.interaction._modifier
    const {interaction, action, selection, cursor} = this.editor
    interaction.hideSelectionBox()*/
    this.editor.interaction.hideSelectionBox()
    this.tool = selector

  },
}

export default selecting