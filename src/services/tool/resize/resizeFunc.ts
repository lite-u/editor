import {ElementInstance} from '~/elements/type'
import {ResizeDirectionName} from '~/services/selection/type'
import {getAnchorsByResizeDirection, getBoundingRectFromBoundingRects} from '~/services/tool/resize/helper'
import ToolManager from '~/services/tool/toolManager'
import {HistoryChangeItem} from '~/services/actions/type'
import {getSameRotationRectsBoundingRect} from '~/core/utils'
import {BoundingRect, Point} from '~/type'
import {rotatePointAroundPoint} from '~/core/geometry'

function resizeFunc(this: ToolManager, elements: ElementInstance[], placement: ResizeDirectionName = 'br'): HistoryChangeItem[] {
  const changes: HistoryChangeItem[] = []
  const {interaction} = this.editor
  const {mouseWorldCurrent, _modifier} = interaction
  const {altKey, shiftKey} = _modifier
  const rectsWithRotation: BoundingRect[] = []
  const rectsWithoutRotation: BoundingRect[] = []
  let applyRotation = elements[0].rotation
  let rect: BoundingRect
  let sameRotation = true
  let anchorNearMouse: Point
  let anchorOppositeMouse: Point

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

  if (applyRotation > 0) {
    anchorNearMouse = rotatePointAroundPoint(anchor.x, anchor.y, centerX, centerY, applyRotation)
    anchorOppositeMouse = rotatePointAroundPoint(opposite.x, opposite.y, centerX, centerY, applyRotation)
  } else {
    anchorNearMouse = anchor
    anchorOppositeMouse = opposite
  }

  let startVec: Point = {
    x: anchorNearMouse.x - anchorOppositeMouse.x,
    y: anchorNearMouse.y - anchorOppositeMouse.y,
  }
  let currentVec: Point
  // let _currentAnchor: Point = mouseWorldCurrent

  /*  if (applyRotation > 0) {
      _currentAnchor = rotatePointAroundPoint(mouseWorldCurrent.x, mouseWorldCurrent.y, centerX, centerY, -applyRotation)
    }*/

  currentVec = {
    x: mouseWorldCurrent.x - anchorOppositeMouse.x,
    y: mouseWorldCurrent.y - anchorOppositeMouse.y,
  }

  if (altKey) {
    startVec = {
      x: anchorNearMouse.x - centerX,
      y: anchorNearMouse.y - centerY,
    }
    currentVec = {
      x: mouseWorldCurrent.x - centerX,
      y: mouseWorldCurrent.y - centerY,
    }
  }

  // console.log('startVecs !!!',startVec.x,startVec.y)
  let scaleX = startVec.x !== 0 ? currentVec.x / startVec.x : 1
  let scaleY = startVec.y !== 0 ? currentVec.y / startVec.y : 1
  // let scaleX = currentVec.x / startVec.x
  // let scaleY = currentVec.y / startVec.y
  /*

    if (startVec.x === 0) {
      scaleX = 1
      if (shiftKey) {
        scaleX = scaleY
      }
    }

    if (startVec.y === 0) {
      scaleY = 1
      if (shiftKey) {
        scaleY = scaleX
      }
    }
  */

  if (shiftKey) {
    if (scaleX === 1) {
      scaleX = scaleY
    } else if (scaleY === 1) {
      scaleY = scaleX
    } else {
      const uniformScale = Math.max(Math.abs(scaleX), Math.abs(scaleY))
      // scaleX = uniformScale
      // scaleY = uniformScale
      scaleX = Math.sign(scaleX) * uniformScale
      scaleY = Math.sign(scaleY) * uniformScale
    }
  }

  const scalingAnchor = altKey ? {x: centerX, y: centerY} : anchorOppositeMouse

  elements.forEach((el: ElementInstance) => {
    const change = el.scaleFrom(scaleX, scaleY, scalingAnchor/*, {x: centerX, y: centerY}*/)
    changes.push(change!)
  })

  return changes
}

export default resizeFunc