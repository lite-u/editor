import {BoundingRect, ElementInstance, UID} from '~/type'
import {getBoundingRectFromBoundingRects} from '~/services/tool/resize/helper'
import dragging from '~/services/tool/selector/dragging/dragging'
import ElementRectangle from '~/elements/rectangle/rectangle'
import Rectangle from '~/elements/rectangle/rectangle'
import {getMinimalBoundingRect} from '~/core/utils'
import {DEFAULT_STROKE} from '~/elements/defaultProps'
import Editor from '~/main/editor'
import {rotatePointAroundPoint} from '~/core/geometry'
import Ellipse from '~/elements/ellipse/ellipse'

export function generateTransformHandles(rect: {
  cx: number,
  cy: number,
  width: number,
  height: number
}, ratio: number, rotation: number, specialLineSeg = false) {
  const result: ElementInstance[] = []

  const resizeLen = 30 / ratio
  const resizeStrokeWidth = 2 / ratio
  const rotateRadius = 50 / ratio
  const {cx, cy, width, height} = rect
  const arr = [
    {name: 'tl', dx: -0.5, dy: -0.5},
    {name: 't', dx: 0.0, dy: -0.5},
    {name: 'tr', dx: 0.5, dy: -0.5},
    {name: 'r', dx: 0.5, dy: 0},
    {name: 'br', dx: 0.5, dy: 0.5},
    {name: 'b', dx: 0, dy: 0.5},
    {name: 'bl', dx: -0.5, dy: 0.5},
    {name: 'l', dx: -0.5, dy: 0},
  ]

  arr.map(({dx, dy, name}) => {
    if (specialLineSeg && name !== 't' && name !== 'b') return

    const {x, y} = rotatePointAroundPoint(cx + dx * width, cy + dy * height, cx, cy, rotation)
    const resizeEle = new Rectangle({
        id: 'handle-resize-' + name,
        layer: 1,
        cx: x,
        cy: y,
        width: resizeLen,
        height: resizeLen,
        rotation,
      },
    )
    const rotateEle = new Ellipse({
      id: 'handle-rotate-' + name,
      layer: 0,
      cx: x,
      cy: y,
      r1: rotateRadius,
      r2: rotateRadius,
      rotation,
      stroke: {
        ...DEFAULT_STROKE,
        weight: resizeStrokeWidth,
      },
    })

    // resizeEle.stroke.enabled = false
    resizeEle.stroke.weight = resizeStrokeWidth
    resizeEle.stroke.color = '#435fb9'
    resizeEle.fill.enabled = true
    resizeEle.fill.color = '#fff'
    rotateEle.stroke.enabled = false

    // overlayHost.append(resizeEle, rotateEle)
  })

  return result
}

export function getManipulationBox(this: Editor) {
  const rectsWithRotation: BoundingRect[] = []
  const rectsWithoutRotation: BoundingRect[] = []
  let rotations: number[] = []
  const boxColor = '#435fb9'
  const {world, action, toolManager, selection, mainHost, overlayHost} = this
  const {scale, dpr} = world
  const ratio = scale * dpr
  const pointLen = 20 / ratio
  const idSet = selection.values
  const visibleElements = mainHost.visibleElements
  const selectedElements = mainHost.getElementsByIdSet(idSet)

  if (selectedElements.length === 0) return

  selectedElements.forEach((ele: ElementInstance) => {
    const centerPoint = ElementRectangle.create('handle-move-center', ele.cx, ele.cy, pointLen)

    centerPoint.stroke.enabled = false
    centerPoint.fill.enabled = true
    centerPoint.fill.color = 'orange'

    overlayHost.append(centerPoint)
    rotations.push(ele.rotation)
    rectsWithRotation.push(ele.getBoundingRect())
    rectsWithoutRotation.push(ele.getBoundingRect(true))
  })

  // selectedOutlineElement
  const sameRotation = rotations.every(val => val === rotations[0])
  let applyRotation = sameRotation ? rotations[0] : 0
  let rect: { cx: number, cy: number, width: number, height: number }
  const specialLineSeg = idSet.size === 1 && selectedElements[0].type === 'lineSegment'

  if (sameRotation) {
    rect = getMinimalBoundingRect(rectsWithoutRotation, applyRotation)
    if (specialLineSeg) {
      rect.width = 1
      rect.cx = selectedElements[0].cx
    }
  } else {
    rect = getBoundingRectFromBoundingRects(rectsWithRotation)
    applyRotation = 0
  }

  const selectedOutlineElement = new ElementRectangle({
    id: 'selected-elements-outline',
    layer: 0,
    show: !specialLineSeg,
    type: 'rectangle',
    ...rect,
    rotation: applyRotation,
    stroke: {
      ...DEFAULT_STROKE,
      weight: 2 / scale,
      color: boxColor,
    },
  })

  overlayHost.append(selectedOutlineElement, ...generateTransformHandles(rect, ratio, applyRotation, specialLineSeg))
}

export function generateElementsClones(this: Editor) {
  const boxColor = '#435fb9'
  const {world, action, toolManager, selection, mainHost, overlayHost} = this
  const {scale, dpr} = world
  const ratio = scale * dpr
  // const pointLen = 20 / ratio
  const idSet = selection.values
  const visibleElements = mainHost.visibleElements
  const selectedElements = mainHost.getElementsByIdSet(idSet)

  // overlayHost.reset()

  const handleTranslateMouseDown = (id: UID) => {
    if (!selection.has(id)) {
      action.dispatch('selection-modify', {mode: 'replace', idSet: new Set([id])})
    }
    toolManager.subTool = dragging
    this.interaction._draggingElements = mainHost.getElementsByIdSet(selection.values)
  }

  const handleTranslateMouseEnter = (ele) => {}
  const handleTranslateMouseLeave = (ele) => {}
  const handleRotateMouseEnter = (ele) => {}
  const handleRotateMouseLeave = (ele) => {}
  const handleRotateMouseDown = (ele) => {
    const rects = selectedElements.map(ele => {
      return ele.getBoundingRect(true)
    })
    const {cx: x, cy: y} = getBoundingRectFromBoundingRects(rects)

    // console.log(interaction._hoveredElement)
    // this.interaction._rotateData = {startRotation: interaction._outlineElement.rotation, targetPoint: {x, y}}
    // this.subTool = rotating
    console.log(sameRotation)
    console.log(applyRotation)
  }
  const handleResizeMouseEnter = () => {}
  const handleResizeMouseLeave = () => {}
  const handleResizeMouseDown = () => {}

  visibleElements.forEach((ele) => {
    const id = ele.id
    const clone = ele.clone()
    const elementSelected = idSet.has(id)

    clone.fill.enabled = false
    clone.stroke.enabled = true
    clone.stroke.weight = 2 / ratio
    clone.stroke.color = elementSelected ? boxColor : 'none'
    overlayHost.append(clone)
    clone.onmousedown = () => handleTranslateMouseDown(id)

    if (!elementSelected) {
      clone.onmouseenter = () => {
        clone.stroke.color = boxColor
        action.dispatch('rerender-overlay')
      }

      clone.onmouseleave = () => {
        clone.stroke.color = 'none'
        action.dispatch('rerender-overlay')
      }
    }

    if (ele.type !== 'path1') {
      const pointLen = 20 / ratio
      const centerPoint = ElementRectangle.create('handle-move-center', ele.cx, ele.cy, pointLen)
      centerPoint.onmousedown = () => handleTranslateMouseDown(id)
      centerPoint.onmouseenter = () => {
        console.log(9)
      }
      centerPoint.onmouseleave = () => {
        console.log(10)
      }
      console.log('go')

      centerPoint.layer = 1
      centerPoint.stroke.enabled = false
      centerPoint.fill.enabled = false
      centerPoint.fill.color = 'orange'
      overlayHost.append(centerPoint)
    }
  })

}

