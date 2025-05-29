import {ElementInstance} from '~/elements/type'
import {ResizeDirectionName} from '~/services/selection/type'
import {getAnchorsByResizeDirection, getBoundingRectFromBoundingRects} from '~/services/tool/resize/helper'
import ToolManager from '~/services/tool/toolManager'
import {HistoryChangeItem} from '~/services/actions/type'
import {getMinimalBoundingRect} from '~/core/utils'
import {BoundingRect} from '~/type'

// import Editor from '~/main/editor'

function resizeFunc(this: ToolManager, elements: ElementInstance[], placement: ResizeDirectionName = 'br'): HistoryChangeItem[] {
  const changes: HistoryChangeItem[] = []
  const {interaction /*action*/} = this.editor
  const {mouseWorldCurrent, _modifier} = interaction
  const {altKey, shiftKey} = _modifier
  const rectsWithRotation: BoundingRect[] = []
  const rectsWithoutRotation: BoundingRect[] = []
  let sameRotation = true

  elements.forEach(element => {
    if (sameRotation && element.rotation !== elements[0].rotation) {
      sameRotation = false
    }

  })
  let rect: { cx: number; cy: number; width: number; height: number }
  //
  if (sameRotation) {
    rect = getMinimalBoundingRect(rectsWithoutRotation, applyRotation)
  } else {
    rect = getBoundingRectFromBoundingRects(rectsWithRotation)
  }

  //
  const rect = getBoundingRectFromBoundingRects(elements.map(el => el.getBoundingRectFromOriginal()))
  const {anchor, opposite} = getAnchorsByResizeDirection(rect, placement)
  const centerX = rect.cx
  const centerY = rect.cy
  const startVec = {
    x: anchor.x - opposite.x,
    y: anchor.y - opposite.y,
  }
  // console.log(rect)
  const currentVec = {
    x: mouseWorldCurrent.x - opposite.x,
    y: mouseWorldCurrent.y - opposite.y,
  }
  // console.log('startVec',startVec)
  // console.log('currentVec',currentVec)

  // console.log(startVec, currentVec)
  let scaleX = startVec.x !== 0 ? currentVec.x / startVec.x : 1
  let scaleY = startVec.y !== 0 ? currentVec.y / startVec.y : 1

  if (shiftKey) {
    const uniformScale = Math.max(Math.abs(scaleX), Math.abs(scaleY))
    scaleX = Math.sign(scaleX) * uniformScale
    scaleY = Math.sign(scaleY) * uniformScale
  }

  const scalingAnchor = altKey ? {x: centerX, y: centerY} : opposite
  // console.log(scaleX, scaleY,scalingAnchor)

  /*  elements.forEach((el: ElementInstance) => {
      scaleElementFrom(el, scaleX, scaleY, opposite)
      // el.scaleFrom(scaleX, scaleY, scalingAnchor)
    })*/
  elements.forEach((el: ElementInstance) => {
    // console.log(scaleX, scaleY, opposite)
    const change = el.scaleFrom(scaleX, scaleY, scalingAnchor)
    changes.push(change!)
  })

  return changes
}

export default resizeFunc