import {SubToolType, ToolType} from '~/services/tool/toolManager'

const dragging: SubToolType = {
  cursor: 'drag',
  mouseMove: function () {
    const {interaction,action} = this.editor
    const dp = interaction.mouseWorldMovement
    console.log('drag')
    // interaction.selectedOutlineElement?.translate(dp.x, dp.y, false)

    // const start = performance.now();
    interaction._draggingElements.forEach(ele => ele.translate(dp.x, dp.y, false))
    // const end = performance.now();
    // console.log(`Canvas render took ${end - start}ms`);

    // this.overlayHost.reset()
    action.dispatch('element-updated')
  },
  mouseUp() {
    const {interaction,action} = this.editor
    // this.action.dispatch('rerender-overlay')

    // this.action.dispatch('rerender-main-host')
    interaction._draggingElements = []
    action.dispatch('element-move', {delta: {x: 0, y: 0}})
    // this.action.dispatch('refresh-overlay')

  },
}

export default dragging