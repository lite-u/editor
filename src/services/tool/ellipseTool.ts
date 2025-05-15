import ToolManager, {ToolType} from '~/services/tool/toolManager'
import nid from '~/core/nid'
import resizeTool from '~/services/tool/resize/resizeTool'
import ElementEllipse, {EllipseProps} from '~/elements/ellipse/ellipse'

const ellipseTool: ToolType = {
  cursor: 'crosshair',
  mouseDown(this: ToolManager) {
    const {elementManager, interaction, action, selection} = this.editor
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const r1 = 1
    const r2 = 1
    const id = 'ellipse-' + nid()
    const rectProps: EllipseProps = {
      type: 'ellipse',
      cx: x - r1 / 2,
      cy: y - r2 / 2,
      r1,
      r2,
      id,
      layer: 0,
    }

    const ele: ElementEllipse = elementManager.add(elementManager.create(rectProps))

    // interaction.state = 'resizing'
    interaction._ele = ele
    action.dispatch('selection-clear')
    selection.replace(new Set([ele.id]))
    action.dispatch('visible-element-updated')
  },
  mouseMove(this: ToolManager) {
    if (!this.editor.interaction._ele) return
    resizeTool.call(this,[this.editor.interaction._ele])
  },
  mouseUp(this: ToolManager) {
    this.editor.interaction._ele = null
  },
}

export default ellipseTool