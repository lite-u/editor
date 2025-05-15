import ToolManager, {ToolType} from '~/services/tool/toolManager'
import nid from '~/core/nid'
import ElementRectangle from '~/elements/rectangle/rectangle'
import resizeTool from '~/services/tool/resize/resizeTool'
import {LineSegmentProps} from '~/elements/lines/lineSegment'

const lineSegmentTool: ToolType = {
  cursor: 'crosshair',
  mouseDown(this: ToolManager) {
    const {elementManager, interaction, action, selection} = this.editor
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const width = 1
    const height = 1
    const id = 'rectangle-' + nid()
    const p1Props:PointProps = {

    }
    const eleProps: LineSegmentProps = {
      type: 'lineSegment',
      points: [{}],
      id,
      layer: 0,
    }

    const ele: ElementRectangle = elementManager.add(elementManager.create(eleProps))

    interaction._ele = ele
    action.dispatch('selection-clear')
    selection.replace(new Set([ele.id]))
  },
  mouseMove(this: ToolManager) {
    if (!this.editor.interaction._ele) return
    this.editor.action.dispatch('visible-element-updated')

    resizeTool.call(this, [this.editor.interaction._ele], 'br')
  },
  mouseUp(this: ToolManager) {
    this.editor.interaction._ele = null
  },
}

export default lineSegmentTool