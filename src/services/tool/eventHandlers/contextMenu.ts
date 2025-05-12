import {detectHoveredModule} from './helper'
import {UID} from '~/core/core'
import ToolManager from '~/services/tool/toolManager'

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
  detectHoveredModule.call(this)
  const lastId = interaction.hoveredModule
  const selectedIdSet = selection.values
  const position = {...interaction.mouseMovePoint}
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
