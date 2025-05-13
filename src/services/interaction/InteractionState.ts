import {UID} from '~/core/core'
import {OperationHandler, ResizeHandle} from '~/services/selection/type'
import {Point, Rect, ToolName} from '~/type'
import {createWith} from '~/lib/lib'
import Editor from '~/main/editor'

export type ViewportManipulationType =
  | 'static'
  | 'waiting'
  | 'panning'
  | 'dragging'
  | 'resizing'
  | 'rotating'
  | 'zooming'
  | 'selecting'

class InteractionState {
  editor: Editor
  mouseDownPoint: Point = {x: 0, y: 0}
  mouseMovePoint: Point = {x: 0, y: 0}
  hoveredElement: UID = ''
  readonly operationHandlers: OperationHandler[] = []
  spaceKeyDown = false
  _snapped = false
  _creatingElementId: UID
  draggingElements: Set<UID> = new Set()
  _selectingElements: Set<UID> = new Set()
  _deselection: UID | null = null
  _resizingOperator: ResizeHandle | null = null
  _rotatingOperator: OperationHandler | null = null
  selectedShadow: Set<UID> = new Set()
  manipulationStatus: ViewportManipulationType = 'static'
  selectionBox: HTMLDivElement | null = null
  _lastTool: ToolName | null = null
  boxColor = '#1FB3FF'
  boxBgColor = 'rgba(31,180,255,0.1)'
  // toolMap: Map<string, ToolManager> = new Map()
  CopyDeltaX = 50
  CopyDeltaY = 100
  // initialized: boolean = false
  // currentToolName: string = 'selector'
  constructor(editor: Editor) {
    this.editor = editor
    this.selectionBox = createWith('div', 'selection-box', editor.id, {
      display: 'none',
      pointerEvents: 'none',
      position: 'absolute',
      border: `1px solid ${this.boxColor}`,
      backgroundColor: `${this.boxBgColor}`,
      zIndex: '10',
    })
    editor.container.appendChild(this.selectionBox)
  }

  updateSelectionBox({x, y, height, width}: Rect, show = true) {
    this.selectionBox!.style.transform = `translate(${x}px, ${y}px)`
    this.selectionBox!.style.width = width + 'px'
    this.selectionBox!.style.height = height + 'px'
    this.selectionBox!.style.display = show ? 'block' : 'none'
  }

  destroy() {
    this.selectionBox?.remove()
    this.selectionBox = null!
  }
}

export default InteractionState