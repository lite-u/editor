import ToolManager, {ToolType} from '~/services/tool/toolManager'
import nid from '~/core/nid'
import ElementRectangle from '~/elements/rectangle/rectangle'
import {LineSegmentProps} from '~/elements/lines/lineSegment'
import resizeTool from '~/services/tool/resize/resizeTool'

const pencilTool: ToolType = {
  cursor: 'crosshair',
  mouseDown(this: ToolManager) {
    const {elementManager, interaction, action, selection} = this.editor
    const {x, y} = this.editor.interaction.mouseWorldCurrent
    const id = 'rectangle-' + nid()
    const eleProps: LineSegmentProps = {
      id,
      layer: 0,
      type: 'lineSegment',
      points: [
        {id: 'start', x, y},
        {id: 'end', x:x+1, y:y+1},
      ],
    }

    const ele: ElementRectangle = elementManager.add(elementManager.create(eleProps))

    interaction._ele = ele
    action.dispatch('selection-clear')
    // selection.replace(new Set([ele.id]))
  },
  mouseMove(this: ToolManager) {


    if (!this.editor.interaction._ele) return
    resizeTool.call(this, [this.editor.interaction._ele], 'br')
  },
  mouseUp(this: ToolManager) {
    this.editor.interaction._ele = null
  },
}

export default pencilTool