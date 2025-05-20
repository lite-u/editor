import ToolManager, {SubToolType} from '~/services/tool/toolManager'

let _mouseMoved = false
const dragging: SubToolType = {
  cursor: 'drag',
  mouseMove(this: ToolManager) {
    _mouseMoved = true
    const {movementX, movementY} = this.editor.interaction._modifier
    const {dpr, scale} = this.editor.world
    const dp = {x: movementX * dpr / scale, y: movementY * dpr / scale}

    this.editor.action.dispatch('element-moving', {delta: dp})
  },
  mouseUp(this: ToolManager) {
    this.editor.interaction._draggingElements = []
    this.editor.action.dispatch('element-move', {delta: {x: 0, y: 0}})
  },
}

export default dragging