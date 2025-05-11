import Editor from '../../editor'
import {detectHoveredModule} from './funcs'
import {UID} from '~/core/core'

function handleContextMenu(this: Editor, e: MouseEvent) {
  // const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey

  e.preventDefault()
  e.stopPropagation()

  /*
  if  if (e.ctrlKey) {
      return false
    }
  */

  detectHoveredModule.call(this)
  const lastId = this.hoveredModule
  const selectedIdSet = this.selection.values
  const position = {...this.viewport.mouseMovePoint}
  let idSet = new Set<UID>()

  // console.log(selectedIdSet,lastId)
  if (lastId) {
    if (selectedIdSet.has(lastId)) {
      idSet = selectedIdSet
    } else {
      idSet.add(lastId)
      this.selection.add(idSet)
      this.action.dispatch('selection-updated')
    }
  }

  this.action.dispatch('context-menu', {
    idSet,
    position,
    copiedItems: this.copiedItems.length > 0,
  })

  return false
}

export default handleContextMenu
