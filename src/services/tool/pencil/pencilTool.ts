import {ToolType} from '~/services/tool/toolManager'
import {convertPointsToBezierPoints, drawLine} from '~/services/tool/pencil/helper'
import {Point} from '~/type'
import {PropsWithoutIdentifiers} from '~/elements/type'

const _drawingPoints: Point[] = []
let _lastPoint = null
const pencilTool: ToolType = {
  cursor: 'crosshair',
  mouseDown: function () {
    const {action, cursor, overlayHost, world, interaction} = this.editor
    const {creationCanvasContext: ctx, scale, dpr} = world
    const point = {...interaction.mouseWorldCurrent}

    cursor.lock()
    action.dispatch('clear-creation')
    _drawingPoints.push(point)
    _lastPoint = {...point}
    drawLine(ctx, _lastPoint, point, 1 / scale * dpr)
  },
  mouseMove: function () {
    if (!interaction._pointDown) return
    const point = {...interaction.mouseWorldCurrent}
    const {creationCanvasContext: ctx, scale, dpr} = world

    _drawingPoints.push(point)
    drawLine(ctx, _lastPoint!, point, 1 / scale * dpr)
    _lastPoint = point
  },
  mouseUp: function () {
    const {interaction, cursor, action} = this.editor
    const {center, points, closed} = convertPointsToBezierPoints(_drawingPoints)

    const eleProps: PropsWithoutIdentifiers<'path'> = {
      type: 'path',
      cx: center.x,
      cy: center.y,
      points,

      closed,
    }
    cursor.unlock()

    action.dispatch('element-add', [eleProps])
    // console.log(points,_lastPoint)
    _drawingPoints.length = 0
    _lastPoint = null
    interaction._ele = null!
    action.dispatch('clear-creation')
  },
}

export default pencilTool