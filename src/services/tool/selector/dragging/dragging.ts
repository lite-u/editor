import ToolManager, {SubToolType} from '~/services/tool/toolManager'

// let _mouseMoved = false
const dragging: SubToolType = {
  cursor: 'drag',
  mouseMove: function () {
    const {interaction, elementManager, selection} = this.editor
    const dp = interaction.mouseWorldMovement
    const elements = elementManager.getElementsByIdSet(selection.values)

    interaction._outlineElement?.translate(dp.x, dp.y)
    interaction._manipulationElements.forEach(ele => ele.translate(dp.x, dp.y))
    elements.forEach(ele => ele.translate(dp.x, dp.y))

    this.editor.action.dispatch('render-overlay')
    this.editor.action.dispatch('render-elements')
  },
  mouseUp(this: ToolManager) {
    this.editor.interaction._draggingElements = []
    this.editor.action.dispatch('element-move', {delta: {x: 0, y: 0}})
  },
}

export default dragging