import {ToolType} from '~/services/tool/toolManager'
import {convertPointsToBezierPoints, drawLine} from '~/services/tool/pencil/helper'
import {Point} from '~/type'
import {PropsWithoutIdentifiers} from '~/elements/type'

const _drawingPoints: Point[] = []
let _lastPoint: { x: number, y: number } | null = null
const pencilTool: ToolType = {
  cursor: 'pencil',
  mouseDown: function () {
    const {action, cursor, overlayHost, world, interaction} = this.editor
    const {scale, dpr, offset} = world
    const point = {...interaction.mouseWorldCurrent}

    cursor.lock()

    console.log(interaction.mouseWorldCurrent)
    _drawingPoints.push(point)
    _lastPoint = {...point}
    drawLine(overlayHost.ctx, _lastPoint, point, 1 * dpr / scale)
  },
  mouseMove: function () {
    const {action, cursor, overlayHost, world, interaction} = this.editor

    if (!_lastPoint) return

    const point = {...interaction.mouseWorldCurrent}
    const {scale, dpr, offset} = world

    console.log([..._drawingPoints])
    _drawingPoints.push(point)
    drawLine(overlayHost.ctx, point, point, 1 * dpr / scale)

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
    _drawingPoints.length = 0
    _lastPoint = null
    interaction._ele = null!
    // action.dispatch('clear-creation')
  },
}

export default pencilTool