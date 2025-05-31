import {ElementInstance} from '~/elements/type'
import {ResizeDirectionName} from '~/services/selection/type'
import {getAnchorsByResizeDirection, getBoundingRectFromBoundingRects} from '~/services/tool/resize/helper'
import ToolManager from '~/services/tool/toolManager'
import {HistoryChangeItem} from '~/services/actions/type'
import {getSameRotationRectsBoundingRect} from '~/core/utils'
import {BoundingRect, Point} from '~/type'
import {rotatePointAroundPoint} from '~/core/geometry'

// import Editor from '~/main/editor'

function resizeFunc(this: ToolManager, elements: ElementInstance[], placement: ResizeDirectionName = 'br'): HistoryChangeItem[] {
  // console.log(placement)
  const changes: HistoryChangeItem[] = []
  const {interaction} = this.editor
  const {mouseWorldCurrent, _modifier} = interaction
  const {altKey, shiftKey} = _modifier
  const rectsWithRotation: BoundingRect[] = []
  const rectsWithoutRotation: BoundingRect[] = []
  let applyRotation = elements[0].rotation
  let rect: BoundingRect
  let sameRotation = true

  elements.forEach(element => {
    if (sameRotation && element.rotation !== elements[0].rotation) {
      sameRotation = false
    }

    rectsWithRotation.push(element.getBoundingRectFromOriginal())
    rectsWithoutRotation.push(element.getBoundingRectFromOriginal(true))
  })

  applyRotation = sameRotation ? applyRotation : 0

  if (sameRotation) {
    rect = getSameRotationRectsBoundingRect(rectsWithoutRotation, applyRotation)
  } else {
    rect = getBoundingRectFromBoundingRects(rectsWithRotation)
  }
  // console.log('rect', sameRotation, rect)
  const {anchor, opposite} = getAnchorsByResizeDirection(rect, placement)
  const centerX = rect.cx
  const centerY = rect.cy
  let startVec: Point = {
    x: anchor.x - opposite.x,
    y: anchor.y - opposite.y,
  }
  let currentVec: Point
  let _currentAnchor: Point = mouseWorldCurrent

  if (applyRotation > 0) {
    _currentAnchor = rotatePointAroundPoint(mouseWorldCurrent.x, mouseWorldCurrent.y, centerX, centerY, -applyRotation)
  }

  currentVec = {
    x: _currentAnchor.x - opposite.x,
    y: _currentAnchor.y - opposite.y,
  }

  if (altKey) {
    startVec = {
      x: anchor.x - centerX,
      y: anchor.y - centerY,
    }
    currentVec = {
      x: _currentAnchor.x - centerX,
      y: _currentAnchor.y - centerY,
    }
  }

  let scaleX = startVec.x !== 0 ? currentVec.x / startVec.x : 1
  let scaleY = startVec.y !== 0 ? currentVec.y / startVec.y : 1
  // let scaleX = currentVec.x / startVec.x
  // let scaleY = currentVec.y / startVec.y

  if (shiftKey) {
    const uniformScale = Math.max(Math.abs(scaleX), Math.abs(scaleY))
    scaleX = Math.sign(scaleX) * uniformScale
    scaleY = Math.sign(scaleY) * uniformScale
  }

  const scalingAnchor = altKey ? {x: centerX, y: centerY} : opposite

  /*  if(altKey){
      scaleX/=2
      scaleY/=2
    }*/
  console.log(scaleX, scaleY, scalingAnchor)

  elements.forEach((el: ElementInstance) => {
    const change = el.scaleFrom(scaleX, scaleY, scalingAnchor, {x: centerX, y: centerY})
    changes.push(change!)
  })

  return changes
}

export default resizeFunc