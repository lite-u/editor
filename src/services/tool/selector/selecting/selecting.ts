import ToolManager, {SubToolType} from '~/services/tool/toolManager'
import {generateBoundingRectFromTwoPoints} from '~/core/utils'
import {BoundingRect} from '~/type'
import {areSetsEqual, getSymmetricDifference} from '~/lib/lib'

let _mouseMoved = false
let _selecting = new Set()
let _selectedCopy: Set<string> | null = null
const selecting: SubToolType = {
  cursor: 'default',
  mouseMove(this: ToolManager,) {
    const {interaction, action, elementManager, selection, cursor} = this.editor
    const {
      mouseStart,
      mouseCurrent,
      mouseWorldStart,
      mouseWorldCurrent,
      _modifier: {shiftKey, metaKey, ctrlKey},
    } = interaction
    const rect = generateBoundingRectFromTwoPoints(mouseStart, mouseCurrent)
    if (!_selectedCopy) {
      _selectedCopy = new Set(selection.values)
    }
    interaction.updateSelectionBox(rect)

    const outer: BoundingRect = generateBoundingRectFromTwoPoints(mouseWorldStart, mouseWorldCurrent)
    const modifyKey = ctrlKey || metaKey || shiftKey

    _mouseMoved = true

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

    if (modifyKey) {
      if (_selecting.size === 0) return
      const SD = getSymmetricDifference(_selectedCopy, _selecting)
      action.dispatch('selection-modify', {
        mode: 'toggle',
        idSet: _selecting,
      })

      console.log(_selectedCopy, _selecting, SD)
    } else {
      if (areSetsEqual(_selectedCopy, _selecting)) return

    }

    return

    // if ((modifyKey && _selecting.size === 0) || areSetsEqual(selectedCopy, _selecting)) return

    const SD = getSymmetricDifference(_selectedCopy, _selecting)
    console.log(SD)

    if (modifyKey) {
      console.log(SD)
      action.dispatch('selection-modify', {
        mode: 'toggle',
        idSet: SD,
      })
    } else {
      action.dispatch('selection-modify', {
        mode: 'replace',
        idSet: _selecting,
      })

      /*
      if (_selecting.size === 0 && selectedCopy.size === 0) {
        return action.dispatch('selection-clear')
      }
      const newSet = new Set([...selectedCopy, ..._selecting])

      action.dispatch('selection-modify', {
        mode: 'replace',
        idSet: newSet,
      })*/
    }

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
    _selecting.clear()
    _selectedCopy?.clear()
    _selectedCopy = null
  },
}

export default selecting