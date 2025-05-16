import ToolManager, {ToolType} from '~/services/tool/toolManager'
import {convertPointsToBezierPoints, drawLine} from '~/services/tool/pencil/helper'
import {Point} from '~/type'
import {PropsWithoutIdentifiers} from '~/elements/type'

const points: Point[] = []
let _lastPoint = null
const pencilTool: ToolType = {
  cursor: 'crosshair',
  mouseDown(this: ToolManager) {
    const {creationCanvasContext: ctx} = this.editor.world
    const point = {...this.editor.interaction.mouseWorldCurrent}

    this.editor.action.dispatch('clear-creation')
    points.push(point)
    _lastPoint = {...point}
    drawLine(ctx, _lastPoint, point)
  },
  mouseMove(this: ToolManager) {
    if (!this.editor.interaction._pointDown) return
    const point = {...this.editor.interaction.mouseWorldCurrent}

    points.push(point)
    drawLine(this.editor.world.creationCanvasContext, _lastPoint!, point)
    _lastPoint = point
  },
  mouseUp(this: ToolManager) {
    const {interaction, action} = this.editor
    const eleProps: PropsWithoutIdentifiers<'path'> = {
      type: 'path',
      points: convertPointsToBezierPoints(points),
      closed: false,
    }

    action.dispatch('element-add', [eleProps])
    points.length = 0
    _lastPoint = null
    interaction._ele = null
    action.dispatch('clear-creation')
  },
}

export default pencilTool