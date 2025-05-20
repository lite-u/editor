import ToolManager from '~/services/tool/toolManager'
// import {detectHoveredElement} from '~/services/tool/helper'
import {UID} from '~/type'

function handleContextMenu(this: ToolManager, e: MouseEvent) {
  // const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey

  e.preventDefault()
  e.stopPropagation()

  /*
  if  if (e.ctrlKey) {
      return false
    }
  */
  const {action, clipboard, interaction, selection} = this.editor
  // detectHoveredElement.call(this)
  const lastId = interaction._hoveredElement
  const selectedIdSet = selection.values
  const position = {...interaction.mouseCurrent}
  let idSet = new Set<UID>()

  // console.log(selectedIdSet,lastId)
  if (lastId) {
    if (selectedIdSet.has(lastId)) {
      idSet = selectedIdSet
    } else {
      idSet.add(lastId)
      selection.add(idSet)
      action.dispatch('selection-updated')
    }
  }

  action.dispatch('context-menu', {
    idSet,
    position,
    copiedItems: clipboard.copiedItems.length > 0,
  })

  return false
}

export default handleContextMenu
