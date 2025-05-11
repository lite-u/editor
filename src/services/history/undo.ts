import {HistoryModules} from './type'
import {extractIdSetFromArray} from './helpers'
import {HistoryNode} from './DoublyLinkedList'
import Editor from '../../engine/editor'

export function undo(this: Editor, quiet: boolean = false): HistoryNode | false {
  if (this.history.current === this.history.head) return false

  const {type, payload} = this.history.current!.data

  // const {selectedModules} = payload
  let modules: HistoryModules | null = null

  switch (type) {
    case 'history-init':
      break
    case 'history-add':
    case 'history-paste':
    case 'history-duplicate':

      // delete modules from added
      this.elementManager.batchDelete(extractIdSetFromArray(payload.modules))

      break

    case 'history-modify':
      payload.changes.map(({id, props}) => {
        const undoProps: Partial<ModuleProps> = {}

        Object.keys(props).forEach(propName => {
          // console.log(props[propName]!['from'])
          undoProps[propName] = props[propName]!['from']
          this.elementManager.batchModify(new Set([id]), undoProps)
        })
      })
      break

    case 'history-move':
      this.batchMove(payload.selectedModules, {
        x: -payload.delta.x,
        y: -payload.delta.y,
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
      modules = payload.modules

      this.elementManager.batchAdd(this.elementManager.batchCreate(modules!))

      break
  }

  this.history.back()
  // this.editor.updateVisibleelementMap(this.editor.viewport.worldRect)
  if (!quiet) {
    const backedNodeSelectedModules = this.history.current!.data.payload.selectedModules

    this.replaceSelected(backedNodeSelectedModules)
    this.action.dispatch('selection-updated')

  }

  return this.history.current as HistoryNode
}