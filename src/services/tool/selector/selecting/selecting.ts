import ToolManager, {SubToolType} from '~/services/tool/toolManager'
import {generateBoundingRectFromTwoPoints} from '~/core/utils'
import {BoundingRect, UID} from '~/type'

let _mouseMoved = false
const selecting: SubToolType = {
  cursor: 'default',
  mouseMove(this: ToolManager,) {
    const {interaction, action, elementManager, selection, cursor} = this.editor
    const {
      mouseStart,
      mouseCurrent,
      mouseWorldStart,
      mouseWorldCurrent,
      _pointDown,
      _modifier: {shiftKey, metaKey, ctrlKey},
    } = interaction
    // if (!_pointDown) return
    _mouseMoved = true
    const rect = generateBoundingRectFromTwoPoints(mouseStart, mouseCurrent)
    interaction.updateSelectionBox(rect)

    const outer: BoundingRect = generateBoundingRectFromTwoPoints(mouseWorldStart, mouseWorldCurrent)
    const _selecting: Set<UID> = new Set()
    const modifyKey = ctrlKey || metaKey || shiftKey

    elementManager.all.forEach((ele) => {
      const inner = ele.getBoundingRect()

      if (
        inner.left >= outer.left &&
        inner.right <= outer.right &&
        inner.top >= outer.top &&
        inner.bottom <= outer.bottom
      ) {
        _selecting.add(ele.id)
      }
    })

    // console.log(_selecting)
    // const selectingChanged = !areSetsEqual(_selectingElements, _selecting)

  },
  mouseUp(this: ToolManager) {
    /*const {shiftKey, metaKey, ctrlKey} = this.editor.interaction._modifier
    const {interaction, action, selection, cursor} = this.editor
    interaction.hideSelectionBox()*/
    this.editor.interaction.hideSelectionBox()
    // this.tool = selector

    if (!_mouseMoved) {
      this.editor.action.dispatch('selection-clear')
    }

    _mouseMoved = false
  },
}

export default selecting