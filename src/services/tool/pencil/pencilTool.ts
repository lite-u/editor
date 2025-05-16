import ToolManager, {ToolType} from '~/services/tool/toolManager'
import nid from '~/core/nid'
import ElementRectangle from '~/elements/rectangle/rectangle'
import {LineSegmentProps} from '~/elements/lines/lineSegment'
import {convertPointsToBezierPoints, drawLine} from '~/services/tool/pencil/helper'

const points = []
let _lastPoint = null
const pencilTool: ToolType = {
  cursor: 'crosshair',
  mouseDown(this: ToolManager) {
    const {creationCanvasContext: ctx} = this.editor.world
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const point = {x, y}

    points.push(point)
    _lastPoint = {...point}
    drawLine(ctx, _lastPoint, point)
  },
  mouseMove(this: ToolManager) {
    if (!this.editor.interaction._pointDown) return
    const {creationCanvasContext: ctx} = this.editor.world
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const point = {x, y}

    points.push(point)
    drawLine(ctx, _lastPoint!, point)
    _lastPoint = {...point}
  },
  mouseUp(this: ToolManager) {
    const {elementManager, interaction, action, selection} = this.editor
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const id = 'rectangle-' + nid()
    interaction._ele = null
    // console.log(points)
    const b = convertPointsToBezierPoints(points)
    console.log(b)
    const eleProps: LineSegmentProps = {
      id,
      layer: 0,
      type: 'lineSegment',
      points: [
        {id: 'start', x, y},
        {id: 'end', x: x + 1, y: y + 1},
      ],
    }

    const ele: ElementRectangle = elementManager.add(elementManager.create(eleProps))

    // interaction._ele = ele
    action.dispatch('selection-clear')
  },
}

export default pencilTool