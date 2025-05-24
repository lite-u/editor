import {ToolType} from '~/services/tool/toolManager'
import {convertPointsToBezierPoints, drawLine} from '~/services/tool/pencil/helper'
import {Point} from '~/type'
import {PropsWithoutIdentifiers} from '~/elements/type'

const _drawingPoints: Point[] = []
let _lastPoint = null
const pencilTool: ToolType = {
  cursor: 'crosshair',
  mouseDown: function () {
    const {creationCanvasContext: ctx, scale, dpr} = this.world
    const point = {...this.interaction.mouseWorldCurrent}

    this.action.dispatch('clear-creation')
    _drawingPoints.push(point)
    _lastPoint = {...point}
    drawLine(ctx, _lastPoint, point, 1 / scale * dpr)
  },
  mouseMove: function () {
    if (!this.interaction._pointDown) return
    const point = {...this.interaction.mouseWorldCurrent}
    const {creationCanvasContext: ctx, scale, dpr} = this.world

    _drawingPoints.push(point)
    drawLine(ctx, _lastPoint!, point, 1 / scale * dpr)
    _lastPoint = point
  },
  mouseUp: function () {
    const {interaction, action} = this
    const {center, points, closed} = convertPointsToBezierPoints(_drawingPoints)

    const eleProps: PropsWithoutIdentifiers<'path'> = {
      type: 'path',
      cx: center.x,
      cy: center.y,
      points,
      closed,
    }

    action.dispatch('element-add', [eleProps])
    // console.log(points,_lastPoint)
    _drawingPoints.length = 0
    _lastPoint = null
    interaction._ele = null!
    action.dispatch('clear-creation')
  },
}

export default pencilTool