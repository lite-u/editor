import {BoundingRect, ElementInstance, UID} from '~/type'
import {getBoundingRectFromBoundingRects} from '~/services/tool/resize/helper'
import dragging from '~/services/tool/selector/dragging/dragging'
import ElementRectangle from '~/elements/rectangle/rectangle'
import {getMinimalBoundingRect} from '~/core/utils'
import {getManipulationBox} from '~/lib/lib'
import {DEFAULT_STROKE} from '~/elements/defaultProps'
import Editor from '~/main/editor'

export function regenerateOverlayElements(this: Editor) {

  const boxColor = '#435fb9'
  const {world, action, toolManager, selection, mainHost, overlayHost} = this
  const {scale, dpr} = world
  const ratio = scale * dpr
  const pointLen = 20 / ratio
  const idSet = selection.values
  const visibleElements = mainHost.visibleElements
  const selectedElements = mainHost.getElementsByIdSet(idSet)
  let rotations: number[] = []

  // overlayHost.reset()

  const rectsWithRotation: BoundingRect[] = []
  const rectsWithoutRotation: BoundingRect[] = []

  const handleTranslateMouseEnter = (ele) => {}
  const handleTranslateMouseLeave = (ele) => {}
  const handleTranslateMouseDown = (id: UID) => {
    if (!selection.has(id)) {
      action.dispatch('selection-modify', {mode: 'replace', idSet: new Set([id])})
    }
    toolManager.subTool = dragging
    this.interaction._draggingElements = mainHost.getElementsByIdSet(selection.values)
  }
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

    clone.onmousedown = () => handleTranslateMouseDown(id)

    overlayHost.append(clone)
  })

  if (selectedElements.length === 0) return

  /*if (selectedElements.length <= 1) {
    // this.selectedOutlineElement = null
    if (selectedElements.length === 0) return
  }*/

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
  const applyRotation = sameRotation ? rotations[0] : 0
  let rect: { cx: number, cy: number, width: number, height: number }
  const specialLineSeg = idSet.size === 1 && selectedElements[0].type === 'lineSegment'

  if (sameRotation) {
    rect = getMinimalBoundingRect(rectsWithoutRotation, applyRotation)
    if (specialLineSeg) {
      rect.width = 1
      rect.cx = selectedElements[0].cx
    }
    overlayHost.append(...getManipulationBox(rect, applyRotation, ratio, specialLineSeg, handleRotate, handleResize))
  } else {
    rect = getBoundingRectFromBoundingRects(rectsWithRotation)
    overlayHost.append(...getManipulationBox(rect, 0, ratio, specialLineSeg, handleRotate, handleResize))
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

  console.log('selectedOutlineElement', selectedOutlineElement)
  overlayHost.append(selectedOutlineElement)
}

