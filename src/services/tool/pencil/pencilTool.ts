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
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const point = {x, y}

    this.editor.action.dispatch('render-creation')
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
    // const {x, y} = this.editor.interaction.mouseWorldCurrent

    // const b = convertPointsToBezierPoints(points)
    const eleProps: PropsWithoutIdentifiers<'path'> = {
      // id,
      // layer: 0,
      type: 'path',
      points: convertPointsToBezierPoints(points),
      closed: false,
    }

    action.dispatch('element-add', [eleProps])
    points.length = 0
    _lastPoint = null
    interaction._ele = null

    // action.dispatch('visible-element-updated')
    // interaction._ele = ele
    // action.dispatch('selection-clear')
  },
}

export default pencilTool