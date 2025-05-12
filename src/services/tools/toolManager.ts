import Editor from '~/main/editor'
import handleMouseUp from '~/services/tools/eventHandlers/mouseUp'
import handleKeyDown from '~/services/tools/eventHandlers/keyDown'
import handleKeyUp from '~/services/tools/eventHandlers/keyUp'
import handleWheel from '~/services/tools/eventHandlers/wheel'
import handlePointerMove from '~/services/tools/eventHandlers/pointerMove'
import handleContextMenu from '~/services/tools/eventHandlers/contextMenu'
import handleMouseDown from '~/services/tools/eventHandlers/mouseDown'
import selector from '~/services/tools/selector/selector'
import {CursorName} from '~/services/cursor/cursor'

export type ToolType = {
  cursor: CursorName
  start: (this: ToolManager, e: MouseEvent) => void
  move: (this: ToolManager, e: PointerEvent) => void
  finish: (this: ToolManager, e: MouseEvent) => void
}
export type ToolName = 'selector' | 'rectangle' | 'text' | 'ellipse' | 'panning'

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
    container.addEventListener('mousedown', handleMouseDown.bind(this), {signal, passive: false})
    container.addEventListener('mouseup', handleMouseUp.bind(this), {signal})
    container.addEventListener('pointermove', handlePointerMove.bind(this), {signal})
    container.addEventListener('contextmenu', handleContextMenu.bind(this), {signal})

    this.toolMap.set('selector', selector)
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