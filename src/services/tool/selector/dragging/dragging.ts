import {SubToolType, ToolType} from '~/services/tool/toolManager'

const dragging: SubToolType = {
  cursor: 'drag',
  mouseMove: function () {
    const {interaction} = this
    const dp = interaction.mouseWorldMovement

    // interaction.selectedOutlineElement?.translate(dp.x, dp.y, false)

    // const start = performance.now();
    interaction._draggingElements.forEach(ele => ele.translate(dp.x, dp.y, false))
    // const end = performance.now();
    // console.log(`Canvas render took ${end - start}ms`);

    this.overlayHost.reset()
    this.action.dispatch('rerender-overlay')
    this.action.dispatch('rerender-main-host')
  },
  mouseUp() {
    // this.action.dispatch('rerender-overlay')

    // this.action.dispatch('rerender-main-host')
    this.interaction._draggingElements = []
    this.action.dispatch('element-move', {delta: {x: 0, y: 0}})
    this.action.dispatch('refresh-overlay')

  },
}

export default dragging