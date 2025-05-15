import ToolManager, {ToolType} from '~/services/tool/toolManager'
import nid from '~/core/nid'
import ElementRectangle from '~/elements/rectangle/rectangle'
import LineSegment, {LineSegmentProps} from '~/elements/lines/lineSegment'
import {PointProps} from '~/elements/point/point'

const lineSegmentTool: ToolType = {
  cursor: 'crosshair',
  mouseDown(this: ToolManager) {
    const {elementManager, interaction, action, selection} = this.editor
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const id = 'rectangle-' + nid()
    const p1Props: PointProps = {x, y}
    const p2Props: PointProps = {x, y}
    const eleProps: LineSegmentProps = {
      type: 'lineSegment',
      points: {start: p1Props, end: p2Props},
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
    const {interaction} = this.editor
    const line = this.editor.interaction._ele as InstanceType<LineSegment>

    line.points.end.x = interaction.mouseWorldDelta.x
    line.points.end.y = interaction.mouseWorldDelta.y

    this.editor.action.dispatch('visible-element-updated')
  },
  mouseUp(this: ToolManager) {
    this.editor.interaction._ele = null
  },
}

export default lineSegmentTool