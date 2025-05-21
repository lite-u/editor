import ToolManager, {SubToolType} from '~/services/tool/toolManager'
import {getRotateAngle} from '~/services/tool/selector/helper'
import {HistoryChangeItem} from '~/services/actions/type'
import selector from '~/services/tool/selector/selector'

const rotating: SubToolType = {
  // cursor: 'default',

  mouseMove: function () {
    const {interaction, elementManager, action, selection, cursor} = this.editor
    const elements = elementManager.getElementsByIdSet(selection.values)
    const {_rotateData, _modifier, mouseWorldCurrent, mouseWorldStart} = interaction
    const {shiftKey} = _modifier

    if (!_rotateData) return

    const {startRotation, targetPoint} = _rotateData
    const mouseStartRotation = getRotateAngle(targetPoint, mouseWorldStart)
    const mouseCurrentRotation = getRotateAngle(targetPoint, mouseWorldCurrent)
    let rotationDiff = mouseCurrentRotation - mouseStartRotation

    if (shiftKey) {
      rotationDiff = Math.round(rotationDiff / 15) * 15
    }

    interaction._outlineElement?.rotateFrom(rotationDiff, targetPoint)
    interaction._manipulationElements.forEach(ele => ele.rotateFrom(rotationDiff, targetPoint))
    elements.forEach(ele => ele.rotateFrom(rotationDiff, targetPoint))
    cursor.rotate(mouseCurrentRotation)

    this.editor.action.dispatch('render-overlay')
    this.editor.action.dispatch('render-elements')

    return rotationDiff
  },
  mouseUp(this: ToolManager) {
    const {interaction, elementManager, action, cursor, selection} = this.editor
    const elements = elementManager.getElementsByIdSet(selection.values)

    const changes: HistoryChangeItem[] = []
    const rotation = rotating.mouseMove.call(this)

    elements.forEach(ele => {
      const change = ele.rotateFrom(rotation, interaction._rotateData?.targetPoint, true)

      ele.updateOriginal()
      changes.push(change)
    })

    // console.log(changes)
    cursor.set(selector.cursor)
    action.dispatch('element-modified', changes)

    this.subTool = null
  },
}

export default rotating

/*

const rotating: SubToolType = {
  data:{},
  start:()=>{},
  end:()=>{}
}*/
