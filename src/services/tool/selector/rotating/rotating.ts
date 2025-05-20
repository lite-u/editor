import ToolManager, {SubToolType} from '~/services/tool/toolManager'
import {getRotateAngle} from '~/services/tool/selector/helper'
import {HistoryChangeItem} from '~/services/actions/type'

const rotating: SubToolType = {
  // cursor: 'default',
  mouseMove(this: ToolManager) {
    const {interaction, elementManager, action, selection, cursor} = this.editor
    const elements = elementManager.getElementsByIdSet(selection.values)
    const {_rotateData, mouseWorldCurrent, mouseWorldStart} = interaction

    if (!_rotateData) return

    const {startRotation, targetPoint} = _rotateData
    const mouseStartRotation = getRotateAngle(targetPoint, mouseWorldStart)
    const mouseCurrentRotation = getRotateAngle(targetPoint, mouseWorldCurrent)
    const rotationDiff = mouseCurrentRotation - mouseStartRotation

    interaction._outlineElement?.rotateFrom(rotationDiff, targetPoint)
    interaction._manipulationElements.forEach(ele => {
      ele.rotateFrom(rotationDiff, targetPoint)
    })
    elements.forEach(ele => {
      ele.rotateFrom(rotationDiff, targetPoint)
    })

    this.editor.action.dispatch('render-overlay')
    this.editor.action.dispatch('render-elements')
  },
  mouseUp(this: ToolManager) {
    const {interaction, elementManager, action, selection} = this.editor
    const elements = elementManager.getElementsByIdSet(selection.values)

    const changes: HistoryChangeItem[] = []
    elements.forEach(ele => {
      const change = ele.rotateFrom(0, interaction._rotateData?.targetPoint, true)

      ele.updateOriginal()
      changes.push(change)
    })

    action.dispatch('element-modified', changes)

    /*on('element-modified', (changes) => {
      this.history.add({
        type: 'history-modify',
        payload: {
          selectedElements: this.selection.values,
          changes,
        },
      })
      console.log(changes)
      this.events.onHistoryUpdated?.(this.history)
      this.events.onElementsUpdated?.(this.elementManager.all)

      dispatch('element-updated')
    })*/
    // this.subTool.mouseUp.call(this)
    this.subTool = null
  },
}

export default rotating