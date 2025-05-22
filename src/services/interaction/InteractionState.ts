import {OperationHandler} from '~/services/selection/type'
import {BoundingRect, Point, Rect, UID} from '~/type'
import {createWith, getManipulationBox} from '~/lib/lib'
import Editor from '~/main/editor'
import {ElementInstance} from '~/elements/type'
import {ToolName} from '~/services/tool/toolManager'
import {getBoundingRectFromBoundingRects} from '~/services/tool/resize/helper'
import {DEFAULT_STROKE} from '~/elements/defaultProps'
import {getMinimalBoundingRect} from '~/core/utils'
import Rectangle from '~/elements/rectangle/rectangle'
import {BezierPoint} from '~/elements/props'
import Ellipse from '~/elements/ellipse/ellipse'
import LineSegment from '~/elements/lines/lineSegment'

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
  _hoveredResizeManipulator: ElementInstance | null = null
  _hoveredRotateManipulator: ElementInstance | null = null

  _draggingElements: ElementInstance[] = []
  _resizingElements: ElementInstance[] = []
  _resizingData: { targetPoint: { x: number, y: number }, placement: string } | null = null
  _rotateData: { startRotation: number, snappedRotation?: number, targetPoint: { x: number, y: number } } | null = null

  _manipulationElements: ElementInstance[] = []
  _controlPoints: ElementInstance[] = []

  readonly operationHandlers: OperationHandler[] = []
  _pointDown = false
  _snapped = false
  _snappedPoint: PointHit | null = null
  _pointHit: PointHit | null = null
  _outlineElement: ElementInstance | null = null
  // _creatingElementId: UID
  // _ele: Set<UID> = new Set()
  _selectingElements: Set<UID> = new Set()
  _deselection: UID | null = null
  // _resizingOperator: ResizeHandle | null = null
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

  createTransformHandles() {
    const {elementManager} = this.editor
    const {scale, dpr} = this.editor.world
    const ratio = scale * dpr
    const idSet = this.editor.selection.values
    const pointLen = 20 / ratio
    const elements = this.editor.elementManager.getElementsByIdSet(idSet)
    let rotations: number[] = []

    if (elements.length <= 1) {
      this._outlineElement = null
      if (elements.length === 0) return
    }

    this._manipulationElements = []

    const rectsWithRotation: BoundingRect[] = []
    const rectsWithoutRotation: BoundingRect[] = []

    elements.forEach((ele: ElementInstance) => {
      // debugger
      const clone = elementManager.create(ele.toMinimalJSON())
      const centerPoint = new Rectangle({
        id: 'handle-move-center',
        layer: 1,
        rotation: ele.rotation,
        type: 'rectangle',
        width: pointLen,
        height: pointLen,
        cx: ele.cx,
        cy: ele.cy,
      })
      centerPoint.stroke.enabled = false
      centerPoint.fill.enabled = true
      centerPoint.fill.color = 'orange'
      // centerPoint._relatedId = ele.id

      clone.fill.enabled = false
      clone.stroke.enabled = true
      clone.stroke.weight = 2 / scale
      clone.stroke.color = '#5491f8'
      // clone._relatedId = ele.id

      this._manipulationElements.push(clone, centerPoint)

      rotations.push(ele.rotation)
      rectsWithRotation.push(ele.getBoundingRect())
      rectsWithoutRotation.push(ele.getBoundingRect(true))
    })

    const sameRotation = rotations.every(val => val === rotations[0])
    const applyRotation = sameRotation ? rotations[0] : 0
    let rect: { cx: number, cy: number, width: number, height: number }
    const specialLineSeg = idSet.size === 1 && elements[0].type === 'lineSegment'

    if (sameRotation) {
      rect = getMinimalBoundingRect(rectsWithoutRotation, applyRotation)
      if (specialLineSeg) {
        rect.width = 1
        rect.cx = elements[0].cx
      }
      this._manipulationElements.push(...getManipulationBox(rect, applyRotation, ratio, specialLineSeg))
    } else {
      rect = getBoundingRectFromBoundingRects(rectsWithRotation)
      this._manipulationElements.push(...getManipulationBox(rect, 0, ratio, specialLineSeg))
    }

    this._outlineElement = new Rectangle({
      id: 'selected-elements-outline',
      layer: 0,
      show: !specialLineSeg,
      type: 'rectangle',
      ...rect,
      rotation: applyRotation,
      stroke: {
        ...DEFAULT_STROKE,
        weight: 2 / scale,
        color: '#5491f8',
      },
    })
  }

  createPathPoints() {
    // const {elementManager} = this.editor
    const {scale, dpr} = this.editor.world
    const ratio = scale * dpr
    const idSet = this.editor.selection.values
    const pointLen = 20 / ratio
    // const eles = this.editor.visible.values
    const pointElements: ElementInstance[] = []
    const elements = this.editor.elementManager.getElementsByIdSet(idSet)
    const resizeStrokeWidth = 2 / ratio

    // console.log(eles)
    elements.forEach(ele => {
      const points: BezierPoint[] = ele.getBezierPoints()
      const {cx, cy} = ele

      points.forEach((point, index) => {
        const anchorPoint = new Rectangle({
          id: ele.id + '-anchor-' + index,
          layer: 1,
          cx: point.anchor.x + cx,
          cy: point.anchor.y + cy,
          width: pointLen,
          height: pointLen,
          fill: {
            enabled: true,
            color: '#fff',
          },
        })

        anchorPoint.stroke.weight = resizeStrokeWidth

        if (point.cp1) {
          const cPX = point.cp1.x + cx
          const cPY = point.cp1.y + cy

          const cp1 = new Ellipse({
            id: ele.id + '-cp1-' + index,
            layer: 1,
            cx: cPX,
            cy: cPY,
            r1: pointLen,
            r2: pointLen,
            fill: {
              enabled: true,
              color: this.boxColor,
            },
          })

          const lineCX = (cPX + cx) / 2
          const lineCY = (cPY + cy) / 2
          const lineStartX = point.cp1.x
          const lineStartY = point.cp1.y
          const lineEndX = point.cp1.x
          const lineEndY = point.cp1.y

          const lineToAnchor = new LineSegment({
            id: ele.id + '-cp1-' + index,
            layer: 1,
            cx: lineCX,
            cy: lineCY,
            points: [
              {id: 'start', x: lineStartX, y: lineStartY},
              {id: 'end', x: lineEndX, y: lineEndY},
            ],
          })
          lineToAnchor.stroke.color = '#ff0000'
          lineToAnchor.stroke.weight = 1 / ratio
          cp1.stroke.enabled = false

          pointElements.push(lineToAnchor, cp1)
        }

        pointElements.push(anchorPoint)

      })
    })

    this.editor.interaction._controlPoints = pointElements
  }

  destroy() {
    this.selectionBox?.remove()
    this.selectionBox = null!
  }
}

export default InteractionState