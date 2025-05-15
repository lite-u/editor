import ToolManager, {ToolType} from '~/services/tool/toolManager'
import nid from '~/core/nid'
import ElementRectangle, {RectangleProps} from '~/elements/rectangle/rectangle'
import resizeTool from '~/services/tool/resize/resizeTool'

const rectangleTool: ToolType = {
  cursor: 'crosshair',
  mouseDown(this: ToolManager) {
    const {elementManager, interaction, action, selection} = this.editor
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const width = 1
    const height = 1
    const id = 'rectangle-' + nid()
    const rectProps: RectangleProps = {
      type: 'rectangle',
      cx: x - width / 2,
      cy: y - height / 2,
      width,
      height,
      id,
      layer: 0,
    }

    const ele: ElementRectangle = elementManager.add(elementManager.create(rectProps))

    interaction.state = 'resizing'
    interaction._ele = ele
    action.dispatch('selection-clear')
    selection.replace(new Set([ele.id]))
    action.dispatch('visible-element-updated')
  },
  mouseMove(this: ToolManager) {
    if (!this.editor.interaction._ele) return
    resizeTool.call(this, [this.editor.interaction._ele])
  },
  mouseUp(this: ToolManager) {
    this.editor.interaction._ele = null
  },
}

export default rectangleTool