import {HistoryElements} from './type'
import {extractIdSetFromArray} from './helpers'
import {HistoryNode} from './DoublyLinkedList'
import Editor from '../../main/editor'

export function undo(this: Editor, quiet: boolean = false): HistoryNode | false {
  if (this.history.current === this.history.head) return false

  const {type, payload} = this.history.current!.data

  // const {selectedElements} = payload
  let elements: HistoryElements | null = null

  switch (type) {
    case 'history-init':
      break
    case 'history-add':
    case 'history-paste':
    case 'history-duplicate':

      // delete elements from added
      this.mainHost.batchDelete(extractIdSetFromArray(payload.elements))

      break

    case 'history-modify':
      payload.changes.map(({id, from}) => {
        const ele = this.mainHost.getElementById(id)

        ele?.restore(from)
      })
      break

    case 'history-reorder':
      break
    case 'history-group':
      break
    case 'history-ungroup':
      break
    case 'history-composite':
      break

    case 'history-delete':
      elements = payload.elements

      this.mainHost.batchAdd(this.mainHost.batchCreate(elements!))

      break
  }

  this.history.back()
  // this.editor.updateVisibleelementMap(this.editor.viewport.worldRect)
  if (!quiet) {
    const backedNodeSelectedElements = this.history.current!.data.payload.selectedElements

    this.selection.replace(backedNodeSelectedElements)
    this.action.dispatch('selection-updated')

  }

  return this.history.current as HistoryNode
}