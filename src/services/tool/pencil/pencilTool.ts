import ToolManager, {ToolType} from '~/services/tool/toolManager'
import {convertPointsToBezierPoints, drawLine} from '~/services/tool/pencil/helper'
import {PathProps} from '~/elements/path/path'
import {Point} from '~/type'
import {OptionalIdentifiersProps, PropsWithoutIdentifiers} from '~/elements/type'

const points: Point[] = []
let _lastPoint = null
const pencilTool: ToolType = {
  cursor: 'crosshair',
  mouseDown(this: ToolManager) {
    const {overlayCanvasContext: ctx} = this.editor.world
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const point = {x, y}
    // const id = 'rectangle-' + nid()
    const eleProps: PropsWithoutIdentifiers<'path'> = {
      // id,
      // layer: 0,
      type: 'path',
      points: convertPointsToBezierPoints(points),
      closed: false,
    }
    const ele = this.editor.elementManager.create(eleProps)
    this.editor.interaction._ele = ele
    points.push(point)
    _lastPoint = {...point}
    drawLine(ctx, _lastPoint, point)
  },
  mouseMove(this: ToolManager) {
    if (!this.editor.interaction._pointDown) return
    const {overlayCanvasContext: ctx} = this.editor.world
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const point = {x, y}

    points.push(point)
    drawLine(ctx, _lastPoint!, point)
    _lastPoint = {...point}
  },
  mouseUp(this: ToolManager) {
    const {elementManager, interaction, action, selection} = this.editor
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    interaction._ele = null

    // const b = convertPointsToBezierPoints(points)

    const eleProps: PathProps = {
      id,
      layer: 0,
      type: 'path',
      points: convertPointsToBezierPoints(points),
      closed: false,
    }

    // const ele: ElementPath = elementManager.add(elementManager.create(eleProps))
    // console.log(eleProps)
    action.dispatch('element-add', [eleProps])
    points.length = 0
    _lastPoint = null
    // action.dispatch('visible-element-updated')
    // interaction._ele = ele
    // action.dispatch('selection-clear')
  },
}

export default pencilTool