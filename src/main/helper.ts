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
import {nid} from '~/index'

export function generateTransformHandles(this: Editor, ele: ElementRectangle, specialLineSeg = false) {
  const {world} = this
  const {scale, dpr} = world
  const ratio = scale * dpr
  const result: ElementInstance[] = []
  const {cx, cy, width, height, rotation} = ele
  const resizeLen = 30 / ratio
  const resizeStrokeWidth = 2 / ratio
  const rotateRadius = 50 / ratio
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
  const handleRotateMouseEnter = (e) => {
    // this.cursor.set('rotate')
    console.log(e)
    console.log('Rotate Enter')
    e.target.fill.color = 'red'
    this.action.dispatch('rerender-overlay')

  }
  const handleRotateMouseLeave = (e) => {
    // this.cursor.set('default')
    console.log('Rotate leave')
    e.target.fill.color = 'blue'
    this.action.dispatch('rerender-overlay')
  }
  const handleRotateMouseDown = (e) => {
    /*  const rects = selectedElements.map(ele => {
        return ele.getBoundingRect(true)
      })
      const {cx: x, cy: y} = getBoundingRectFromBoundingRects(rects)

      // console.log(interaction._hoveredElement)
      // this.interaction._rotateData = {startRotation: interaction._outlineElement.rotation, targetPoint: {x, y}}
      // this.subTool = rotating
      console.log(sameRotation)
      console.log(applyRotation)*/
  }

  const handleResizeMouseEnter = (e) => {
    // this.cursor.set('nw-resize')
    console.log('Resize Enter')
    e.target.fill.color = 'red'
    this.action.dispatch('rerender-overlay')
  }
  const handleResizeMouseLeave = (e) => {
    // this.cursor.set('default')
    console.log('Resize leave')
    e.target.fill.color = '#ffffff'
    this.action.dispatch('rerender-overlay')
  }

  const handleResizeMouseDown = () => {}

  arr.map(({dx, dy, name}) => {
    if (specialLineSeg && name !== 't' && name !== 'b') return

    const {x, y} = rotatePointAroundPoint(cx + dx * width, cy + dy * height, cx, cy, rotation)
    const resizeEle = Rectangle.create('handle-resize-' + name, x, y, resizeLen)
    const rotateEle = Ellipse.create('handle-rotate-' + name, x, y, rotateRadius)

    resizeEle.rotation = rotation
    resizeEle.layer = 3
    resizeEle.fill.enabled = true
    resizeEle.fill.color = '#ffffff'
    resizeEle.stroke.weight = resizeStrokeWidth
    resizeEle.stroke.color = '#435fb9'

    rotateEle.layer = 2
    rotateEle.rotation = rotation
    rotateEle.stroke.enabled = false
    rotateEle.stroke.weight = 0
    rotateEle.fill.enabled = true
    rotateEle.fill.color = 'blue'

    resizeEle.onmouseenter = handleResizeMouseEnter
    resizeEle.onmouseleave = handleResizeMouseLeave
    resizeEle.onmousedown = handleResizeMouseDown
    rotateEle.onmouseenter = handleRotateMouseEnter
    rotateEle.onmouseleave = handleRotateMouseLeave
    rotateEle.onmousedown = handleRotateMouseDown

    this.overlayHost.append(resizeEle, rotateEle)
  })

  return result
}

export function getSelectedBoundingElement(this: Editor): ElementRectangle {
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

  selectedElements.forEach((ele: ElementInstance) => {
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

  overlayHost.append(selectedOutlineElement)

  return selectedOutlineElement
}

export function generateElementsClones(this: Editor) {
  const boxColor = '#435fb9'
  const {world, action, toolManager, selection, mainHost, overlayHost} = this
  const {scale, dpr} = world
  const ratio = scale * dpr
  const idSet = selection.values
  const visibleElements = mainHost.visibleElements
  const strokeWidth = 10 / ratio
  const handleTranslateMouseDown = (id: UID) => {
    if (!selection.has(id)) {
      action.dispatch('selection-modify', {mode: 'replace', idSet: new Set([id])})
    }
    toolManager.subTool = dragging
    this.interaction._draggingElements = mainHost.getElementsByIdSet(selection.values)
  }

  visibleElements.forEach((ele) => {
    const id = ele.id
    const invisibleClone = ele.clone()
    const cloneStrokeLine = ele.clone()
    const elementSelected = idSet.has(id)

    invisibleClone.id = 'invisible-clone-' + id
    invisibleClone.layer = 0
    invisibleClone.fill.enabled = false
    invisibleClone.stroke.enabled = true
    invisibleClone.stroke.color = 'none'

    cloneStrokeLine.id = 'stroke-line-clone-' + id
    cloneStrokeLine.layer = 1
    cloneStrokeLine.stroke.weight = strokeWidth

    invisibleClone.onmousedown = () => handleTranslateMouseDown(id)
    cloneStrokeLine.onmousedown = () => handleTranslateMouseDown(id)
    overlayHost.append(invisibleClone, cloneStrokeLine)

    if (elementSelected) {
      cloneStrokeLine.stroke.color = boxColor
    } else {
      cloneStrokeLine.stroke.color = 'none'

      invisibleClone.onmouseenter =cloneStrokeLine.onmouseenter = () => {
        cloneStrokeLine.stroke.color = boxColor
        action.dispatch('rerender-overlay')
      }

      invisibleClone.onmouseleave = cloneStrokeLine.onmouseleave = () => {
        cloneStrokeLine.stroke.color = 'none'
        action.dispatch('rerender-overlay')
      }
    }

    if (ele.type !== 'path') {
      const pointLen = 20 / ratio
      const centerPoint = ElementRectangle.create(nid(), ele.cx, ele.cy, pointLen)
      centerPoint.onmousedown = () => handleTranslateMouseDown(id)

      centerPoint.layer = 1
      centerPoint.stroke.enabled = false
      centerPoint.fill.enabled = true
      centerPoint.fill.color = 'orange'
      overlayHost.append(centerPoint)
    }
  })

}

