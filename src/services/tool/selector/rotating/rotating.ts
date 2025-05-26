import {SubToolType} from '~/services/tool/toolManager'
import {getRotateAngle} from '~/services/tool/selector/helper'
import {HistoryChangeItem} from '~/services/actions/type'

const rotating: SubToolType = {
  // cursor: 'default',

  mouseMove: function () {
    const {interaction, mainHost, selection, cursor} = this
    const elements = mainHost.getElementsByIdSet(selection.values)
    const {_rotateData, _modifier, mouseWorldCurrent, mouseWorldStart} = interaction
    const {shiftKey} = _modifier

    if (!_rotateData) return

    const {targetPoint} = _rotateData
    const mouseStartRotation = getRotateAngle(targetPoint, mouseWorldStart)
    const mouseCurrentRotation = getRotateAngle(targetPoint, mouseWorldCurrent)
    let rotationDiff = mouseCurrentRotation - mouseStartRotation

    if (shiftKey) {
      rotationDiff = Math.round(rotationDiff / 15) * 15
    }

    elements.forEach(ele => ele.rotateFrom(rotationDiff, targetPoint))
    cursor.rotate(mouseCurrentRotation)

    this.overlayHost.reset()
    this.action.dispatch('rerender-overlay')
    this.action.dispatch('rerender-main-host')

    return rotationDiff
  },
  mouseUp() {
    const {interaction, mainHost, action, cursor, selection} = this
    const elements = mainHost.getElementsByIdSet(selection.values)

    const changes: HistoryChangeItem[] = []
    const rotation = rotating.mouseMove.call(this)

    elements.forEach(ele => {
      const change = ele.rotateFrom(rotation, interaction._rotateData?.targetPoint, true)

      ele.updateOriginal()
      changes.push(change)
    })

    // cursor.set(selector.cursor)
    action.dispatch('element-modified', changes)
    this.interaction._rotateData = null
  },
}

export default rotating