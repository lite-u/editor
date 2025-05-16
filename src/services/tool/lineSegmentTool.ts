import ToolManager, {ToolType} from '~/services/tool/toolManager'
import ElementRectangle from '~/elements/rectangle/rectangle'
import resizeTool from '~/services/tool/resize/resizeTool'
import {PropsWithoutIdentifiers} from '~/elements/type'

const lineSegmentTool: ToolType = {
  cursor: 'crosshair',
  mouseDown(this: ToolManager) {
    const {elementManager, interaction, world} = this.editor
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const eleProps: PropsWithoutIdentifiers<'lineSegment'> = {
      type: 'lineSegment',
      points: [
        {id: 'start', x, y},
        {id: 'end', x: x + 1, y: y + 1},
      ],
    }

    const ele: ElementRectangle = elementManager.create(eleProps)

    ele.render(world.creationCanvasContext)
    interaction._ele = ele
  },
  mouseMove(this: ToolManager) {
    if (!this.editor.interaction._ele) return
    this.editor.action.dispatch('clear-creation')

    resizeTool.call(this, [this.editor.interaction._ele], 'br')
    this.editor.interaction._ele.render(this.editor.world.creationCanvasContext)
  },
  mouseUp(this: ToolManager) {
    const eleProps = this.editor.interaction._ele.toMinimalJSON()

    this.editor.action.dispatch('element-add', [eleProps])
    this.editor.interaction._ele = null
  },
}

export default lineSegmentTool