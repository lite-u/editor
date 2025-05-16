import Editor from '~/main/editor'
import handleMouseUp from '~/services/tool/baseEvents/pointerUp'
import handleKeyDown from '~/services/tool/baseEvents/keyDown'
import handleKeyUp from '~/services/tool/baseEvents/keyUp'
import handleWheel from '~/services/tool/baseEvents/wheel'
import handlePointerMove from '~/services/tool/baseEvents/pointerMove'
import handleContextMenu from '~/services/tool/baseEvents/contextMenu'
import handleMouseDown from '~/services/tool/baseEvents/pointerDown'
import selector from '~/services/tool/selector/selector'
import {CursorName} from '~/services/cursor/cursor'
import rectangleTool from '~/services/tool/rectangle/rectangleTool'
import panning from '~/services/tool/panning/panning'
import ellipseTool from '~/services/tool/ellipseTool'
import textTool from '~/services/tool/textTool'
import lineSegmentTool from '~/services/tool/lineSegmentTool'
import pencilTool from '~/services/tool/pencil/pencilTool'

export type ToolType = {
  cursor: CursorName
  mouseDown: (this: ToolManager) => void
  mouseMove: (this: ToolManager) => void
  mouseUp: (this: ToolManager) => void
  // keyDown: (this: ToolManager) => void
  // keyUp: (this: ToolManager) => void
}
export type ToolName = 'selector' | 'rectangle' | 'text' | 'ellipse' | 'panning' | 'lineSegment' | 'path' | 'pencil'

class ToolManager {
  editor: Editor
  eventsController = new AbortController()
  toolMap: Map<ToolName, ToolType> = new Map()
  tool: ToolType
  currentToolName: ToolName

  constructor(editor: Editor) {
    const {signal} = this.eventsController
    const {container} = editor

    this.editor = editor

    window.addEventListener('keydown', handleKeyDown.bind(this), {signal})
    window.addEventListener('keyup', handleKeyUp.bind(this), {signal})
    window.addEventListener('wheel', handleWheel.bind(this), {signal, passive: false})
    container.addEventListener('pointerdown', handleMouseDown.bind(this), {signal, passive: false})
    container.addEventListener('pointerup', handleMouseUp.bind(this), {signal})
    container.addEventListener('pointermove', handlePointerMove.bind(this), {signal})
    container.addEventListener('contextmenu', handleContextMenu.bind(this), {signal})

    this.toolMap.set('selector', selector)
    this.toolMap.set('panning', panning)
    this.toolMap.set('rectangle', rectangleTool)
    this.toolMap.set('ellipse', ellipseTool)
    this.toolMap.set('text', textTool)
    this.toolMap.set('lineSegment', lineSegmentTool)
    this.toolMap.set('pencil', pencilTool)

    this.currentToolName = 'selector'
    this.tool = selector
  }

  set(name: ToolName) {
    const tool = this.toolMap.get(name)

    if (tool) {
      this.currentToolName = name
      this.tool = tool
      this.editor.cursor.set(tool.cursor)
    }
  }

  destroy() {
    this.eventsController.abort()
    this.eventsController = null!
    this.editor = null!
    this.toolMap.clear()
    this.toolMap = null!
    this.tool = null!
    this.currentToolName = null!
  }
}

export default ToolManager