import ToolManager, {ToolType} from '~/services/tool/toolManager'
import nid from '~/core/nid'
import ElementRectangle from '~/elements/rectangle/rectangle'
import {LineSegmentProps} from '~/elements/lines/lineSegment'

const points = []
const pencilTool: ToolType = {
  cursor: 'crosshair',
  mouseDown(this: ToolManager) {
    const {creationCanvasContext: ctx} = this.editor.world
    const {x, y} = this.editor.interaction.mouseWorldCurrent

    this.editor.action.dispatch('selection-clear')

    ctx.save()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 100
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 100, y + 100)
    ctx.stroke()
    ctx.restore()
  },
  mouseMove(this: ToolManager) {
    const {overlayCanvasContext: ctx} = this.editor.world
    const {x, y} = this.editor.interaction.mouseWorldCurrent

    this.editor.action.dispatch('selection-clear')

    ctx.save()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 100
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 100, y + 100)
    ctx.stroke()
    ctx.restore()
  },
  mouseUp(this: ToolManager) {
    const {elementManager, interaction, action, selection} = this.editor
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const id = 'rectangle-' + nid()
    interaction._ele = null

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