import ToolManager, {SubToolType} from '~/services/tool/toolManager'

let _mouseMoved = false
const dragging: SubToolType = {
  cursor: 'drag',
  mouseMove(this: ToolManager) {
    _mouseMoved = true
    const {interaction, elementManager, selection} = this.editor
    const {movementX, movementY} = interaction._modifier
    const {dpr, scale} = this.editor.world
    const dp = {x: movementX * dpr / scale, y: movementY * dpr / scale}
    const elements = elementManager.getElementsByIdSet(selection.values)

    // this.editor.action.dispatch('element-moving', {delta: dp})

    interaction._outlineElement?.translate(dp.x, dp.y)
    interaction._manipulationElements.forEach(ele => {
      ele.translate(dp.x, dp.y)
    })
    elements.forEach(ele => {
      ele.translate(dp.x, dp.y)
    })
    this.editor.action.dispatch('render-overlay')
    this.editor.action.dispatch('render-elements')
  },
  mouseUp(this: ToolManager) {
    this.editor.interaction._draggingElements = []
    this.editor.action.dispatch('element-move', {delta: {x: 0, y: 0}})
  },
}

export default dragging