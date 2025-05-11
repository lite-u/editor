import Editor from '~/main/editor'
import handleMouseUp from '~/services/tools/eventHandlers/mouseUp'
import handleKeyDown from '~/services/tools/eventHandlers/keyDown'
import handleKeyUp from '~/services/tools/eventHandlers/keyUp'
import handleWheel from '~/services/tools/eventHandlers/wheel'
import handlePointerMove from '~/services/tools/eventHandlers/pointerMove'
import handleContextMenu from '~/services/tools/eventHandlers/contextMenu'
import {Point} from '~/type'
import handleMouseDown from '~/services/tools/eventHandlers/mouseDown'

export type ToolType = {
  start: (this: Editor, e: MouseEvent) => void
  move: (this: Editor, e: PointerEvent) => void
  finish: (this: Editor, e: MouseEvent) => void
}
export type ToolName = 'selector' | 'rectangle' | 'text' | 'ellipse' | 'panning'

class ToolManager {
  editor: Editor
  eventsController = new AbortController()
  mouseDownPoint: Point = {x: 0, y: 0}
  mouseMovePoint: Point = {x: 0, y: 0}
  toolMap: Map<ToolName, ToolType> = new Map()
  spaceKeyDown: boolean = false
  tool: ToolType
  currentToolName: ToolName

  constructor(editor: Editor) {
    const {signal} = this.eventsController
    const {container} = editor

    this.editor = editor

    container.addEventListener('mousedown', handleMouseDown.bind(this), {
      signal,
      passive: false,
    })
    container.addEventListener('mouseup', handleMouseUp.bind(this), {signal})
    window.addEventListener('keydown', handleKeyDown.bind(this), {signal})
    window.addEventListener('keyup', handleKeyUp.bind(this), {signal})
    window.addEventListener('wheel', handleWheel.bind(this), {
      signal,
      passive: false,
    })
    container.addEventListener('pointermove', handlePointerMove.bind(this), {signal})
    container.addEventListener('contextmenu', handleContextMenu.bind(this), {signal})
  }

  switch(tool: ToolName) {
    this.currentToolName = tool
    this.tool = this.toolMap.get(tool)
  }

  // currentTool: Tool

  register() {}

  destroy() {
    this.eventsController.abort()
    this.eventsController = null!
    this.editor = null!
    this.mouseDownPoint = null!
    this.mouseMovePoint = null!
    this.toolMap.clear()
    this.toolMap = null!
    this.spaceKeyDown = null!
    this.tool = null!
    this.currentToolName = null!
  }
}

export default ToolManager