import ToolManager, {SubToolType} from '~/services/tool/toolManager'

let _mouseMoved = false
const dragging: SubToolType = {
  cursor: 'drag',
  mouseMove(this: ToolManager) {
    _mouseMoved = true
    const {movementX, movementY} = this.editor.interaction._modifier
    const {dpr, scale} = this.editor.world
    const ratio = dpr * scale
    const dp3 = {x: movementX / ratio, y: movementY / ratio}
    this.editor.action.dispatch('element-moving', {delta: {...dp3}})
  },
  mouseUp(this: ToolManager) {
  },
}

export default dragging