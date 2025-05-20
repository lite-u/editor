import {OperationHandler, ResizeHandle} from '~/services/selection/type'
import {Point, Rect, UID} from '~/type'
import {createWith, getManipulationBox} from '~/lib/lib'
import Editor from '~/main/editor'
import {ElementInstance, OptionalIdentifiersProps} from '~/elements/type'
import {ToolName} from '~/services/tool/toolManager'
import {getAnchorsByBoundingRect, getBoundingRectFromBoundingRects} from '~/services/tool/resize/helper'
import {DEFAULT_FILL, DEFAULT_STROKE} from '~/elements/defaultProps'

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
  movementX: number
  movementY: number
}
export type PointHit = {
  x: number
  y: number
  type: 'center' | 'anchor' | 'path'
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

  _hoveredElement: ElementInstance | null = null
  readonly operationHandlers: OperationHandler[] = []
  _pointDown = false
  _snapped = false
  _snappedPoint: PointHit | null = null
  _pointHit: PointHit | null = null
  _outlineElement: ElementInstance | null = null
  _draggingElements: ElementInstance[] = []
  // spaceKeyDown = false
  // _creatingElementId: UID
  // _ele: Set<UID> = new Set()
  _selectingElements: Set<UID> = new Set()
  _deselection: UID | null = null
  _resizingOperator: ResizeHandle | null = null
  _rotatingOperator: OperationHandler | null = null
  selectedShadow: Set<UID> = new Set()
  _ele: ElementInstance
  _modifier: Modifier = {
    button: -2,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    ctrlKey: false,
    movementX: 0,
    movementY: 0,
  }
  selectionBox: HTMLDivElement | null = null
  _lastTool: ToolName | null = null
  boxColor = '#006bfa'
  boxBgColor = 'rgba(31,180,255,0.1)'
  // toolMap: Map<string, ToolManager> = new Map()
  copyDeltaX = 10
  copyDeltaY = 10
  // initialized: boolean = false
  // currentToolName: string = 'selector'
  constructor(editor: Editor) {
    this.editor = editor
    this.selectionBox = createWith('div', 'selection-box', editor.id, {
      display: 'none',
      pointerEvents: 'none',
      position: 'absolute',
      border: `1px dashed ${this.boxColor}`,
      // backgroundColor: `${this.boxBgColor}`,
      backgroundColor: 'transparent',
      zIndex: '10',
    })
    editor.container.appendChild(this.selectionBox)
  }

  hideSelectionBox(): void {
    this.selectionBox!.style.display = 'none'
  }

  updateSelectionBox({x, y, height, width}: Rect) {
    this.selectionBox!.style.transform = `translate(${x}px, ${y}px)`
    this.selectionBox!.style.width = width + 'px'
    this.selectionBox!.style.height = height + 'px'
    this.selectionBox!.style.display = 'block'
  }

  updateControlPoints() {
    const {scale, dpr} = this.editor.world
    const ratio = scale * dpr
    const idSet = this.editor.selection.values

    if (idSet.size <= 1) {
      this._outlineElement = null
      return
    }

    let rotations: number[] = []
    const elements = this.editor.elementManager.getElementsByIdSet(idSet)
    const rects = elements.map((ele: ElementInstance) => {
      rotations.push(ele.rotation)
      return ele.getBoundingRect()
    })
    const rect = getBoundingRectFromBoundingRects(rects)
    const anchors = getAnchorsByBoundingRect(rect)
    const sameRotation = rotations.every(val => val === rotations[0])
    // create outline rectangle for multiple selection
    const controlElements = getManipulationBox(rect, sameRotation ? rotations[0] : 0, ratio)
    // const manipulationBox =
    const outlineElementProps: OptionalIdentifiersProps = {
      type: 'rectangle',
      ...rect,
      stroke: {
        ...DEFAULT_STROKE,
        // weight: 1 / ratio,
        weight: 1 / ratio,
        color: 'red',
      },
      fill: {
        ...DEFAULT_FILL,
        // enabled: true,
        color: 'green',
      },
    }

    this._outlineElement = this.editor.elementManager.create(outlineElementProps)
  }

  destroy() {
    this.selectionBox?.remove()
    this.selectionBox = null!
  }
}

export default InteractionState