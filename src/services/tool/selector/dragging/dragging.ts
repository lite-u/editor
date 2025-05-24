import {SubToolType, ToolType} from '~/services/tool/toolManager'

const dragging: SubToolType = {
  cursor: 'drag',
  mouseMove: function () {
    const {interaction} = this
    const dp = interaction.mouseWorldMovement

    interaction._outlineElement?.translate(dp.x, dp.y, false)
    interaction._draggingElements.forEach(ele => ele.translate(dp.x, dp.y, false))

    this.action.dispatch('render-overlay')
    this.action.dispatch('render-elements')
  },
  mouseUp() {
    this.interaction._draggingElements = []
    this.action.dispatch('element-move', {delta: {x: 0, y: 0}})
  },
}

export default dragging