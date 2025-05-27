import {BoundingRect, ElementInstance, UID} from '~/type'
import {getBoundingRectFromBoundingRects} from '~/services/tool/resize/helper'
import ElementRectangle from '~/elements/rectangle/rectangle'
import Rectangle from '~/elements/rectangle/rectangle'
import {getMinimalBoundingRect} from '~/core/utils'
import {DEFAULT_STROKE} from '~/elements/defaultProps'
import Editor from '~/main/editor'
import {rotatePointAroundPoint} from '~/core/geometry'
import Ellipse from '~/elements/ellipse/ellipse'
import {nid} from '~/index'
import {getRotateAngle} from '~/services/tool/selector/helper'
import {ResizeDirectionName} from '~/services/selection/type'

export function generateTransformHandles(this: Editor, ele: ElementRectangle, specialLineSeg = false) {
  const {world} = this
  const {scale, dpr} = world
  const ratio = dpr / scale
  const result: ElementInstance[] = []
  const {cx, cy, width, height, rotation} = ele
  const resizeLen = 8 * ratio
  const resizeStrokeWidth = 1 * ratio
  const rotateRadius = 50 * ratio
  const arr: { name: ResizeDirectionName, dx: number, dy: number }[] = [
    {name: 'tl', dx: -0.5, dy: -0.5},
    {name: 't', dx: 0.0, dy: -0.5},
    {name: 'tr', dx: 0.5, dy: -0.5},
    {name: 'r', dx: 0.5, dy: 0},
    {name: 'br', dx: 0.5, dy: 0.5},
    {name: 'b', dx: 0, dy: 0.5},
    {name: 'bl', dx: -0.5, dy: 0.5},
    {name: 'l', dx: -0.5, dy: 0},
  ]

  const handleRotateMouseEnter = () => {
    const mouseCurrentRotation = getRotateAngle({x: cx, y: cy}, this.interaction.mouseWorldCurrent)

    this.cursor.set('rotate')
    this.cursor.rotate(mouseCurrentRotation)
  }

  const handleRotateMouseLeave = () => {
    this.cursor.set(this.toolManager.tool.cursor)
    this.action.dispatch('rerender-overlay')
  }

  const handleRotateMouseDown = (e) => {
    this.interaction._rotateData = {startRotation: rotation, targetPoint: {x: cx, y: cy}}
    const mouseCurrentRotation = getRotateAngle({x: cx, y: cy}, this.interaction.mouseWorldCurrent)

    // console.log('prev')
    // (e.originalEvent.stopPropagation())
    this.cursor.rotate(mouseCurrentRotation)
  }

  const handleResizeMouseEnter = () => {
    this.cursor.set('nw-resize')
    // console.log('Resize Enter')
    this.action.dispatch('rerender-overlay')
  }
  const handleResizeMouseLeave = () => {
    this.cursor.set('default')
    // e.target.fill.color = '#ffffff'
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
    resizeEle.updatePath2D()
    resizeEle.updateBoundingRect()

    rotateEle.layer = 2
    rotateEle.rotation = rotation
    rotateEle.stroke.enabled = false
    rotateEle.stroke.weight = 0
    rotateEle.fill.enabled = true
    rotateEle.fill.color = 'transparent'

    // Set rotateEle arc angles based on position (degrees, will convert to radians)
    const angleMap: Record<ResizeDirectionName, number[]> = {
      't': [180, 360],
      'tr': [180, 90],
      'r': [270, 90],
      'br': [270, 180],
      'b': [360, 180],
      'bl': [0, 270],
      'l': [90, 270],
      'tl': [90, 360],
    }

    if (angleMap[name]) {
      const [startDeg, endDeg] = angleMap[name]
      rotateEle.startAngle = startDeg
      rotateEle.endAngle = endDeg
      rotateEle.updatePath2D()
      rotateEle.updateBoundingRect()
    }

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
  const ratio = dpr / scale
  const pointLen = 2 / ratio
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
    // toolManager.subTool = dragging
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

      invisibleClone.onmouseenter = cloneStrokeLine.onmouseenter = () => {
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

