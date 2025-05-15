import ToolManager, {ToolType} from '~/services/tool/toolManager'
import nid from '~/core/nid'
import ElementRectangle from '~/elements/rectangle/rectangle'
import LineSegment, {LineSegmentProps} from '~/elements/lines/lineSegment'
import {PointProps} from '~/elements/point/point'
import {getRotateAngle} from '~/services/tool/selector/helper'
import ElementLineSegment from '~/elements/lines/lineSegment'

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
    const {points: {start, end}} = this.editor.interaction._ele as InstanceType<ElementLineSegment>

    end.x = interaction.mouseWorldDelta.x
    end.y = interaction.mouseWorldDelta.y

    console.log(getRotateAngle(start, end))

    this.editor.action.dispatch('visible-element-updated')
  },
  mouseUp(this: ToolManager) {
    this.editor.interaction._ele = null
  },
}

export default lineSegmentTool