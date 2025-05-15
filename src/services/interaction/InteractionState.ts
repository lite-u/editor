import {UID} from '~/core/core'
import {OperationHandler, ResizeHandle} from '~/services/selection/type'
import {Point, Rect} from '~/type'
import {createWith} from '~/lib/lib'
import Editor from '~/main/editor'
import {ElementInstance} from '~/elements/type'
import {ToolName} from '~/services/tool/toolManager'

export type EditorManipulationType =
  | 'static'
  | 'waiting'
  | 'panning'
  | 'dragging'
  | 'resizing'
  | 'rotating'
  | 'zooming'
  | 'selecting'

export type Modifier = {
  button: number
  altKey: boolean
  shiftKey: boolean
  metaKey: boolean
  ctrlKey: boolean
}

class InteractionState {
  editor: Editor
  state: EditorManipulationType = 'static'

  mouseStart: Point = {x: 0, y: 0}
  mouseCurrent: Point = {x: 0, y: 0}
  mouseDelta: Point = {x: 0, y: 0}

  mouseWorldStart: Point = {x: 0, y: 0}
  mouseWorldCurrent: Point = {x: 0, y: 0}
  mouseWorldDelta: Point = {x: 0, y: 0}

  hoveredElement: UID = ''
  readonly operationHandlers: OperationHandler[] = []
  spaceKeyDown = false
  _snapped = false
  // _creatingElementId: UID
  // _ele: Set<UID> = new Set()
  _selectingElements: Set<UID> = new Set()
  _deselection: UID | null = null
  _resizingOperator: ResizeHandle | null = null
  _rotatingOperator: OperationHandler | null = null
  selectedShadow: Set<UID> = new Set()
  _ele: ElementInstance
  _modifier: Modifier = {
    button: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    ctrlKey: false,
  }
  selectionBox: HTMLDivElement | null = null
  _lastTool: ToolName | null = null
  boxColor = '#1FB3FF'
  boxBgColor = 'rgba(31,180,255,0.1)'
  // toolMap: Map<string, ToolManager> = new Map()
  // CopyDeltaX = 50
  // CopyDeltaY = 100
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