import {UID} from '~/core/core'
import Editor from '~/engine/editor'
import {SelectionActionMode} from '~/services/selection/type'
import {modifySelected} from './helper'
import {ElementProps} from '~/elements/elements'

class Selection {
  protected selectedElementIDSet: Set<UID> = new Set()
  editor: Editor

  constructor(editor: Editor) {
    this.editor = editor
  }

  public get getSelected(): Set<UID> {
    return new Set(this.selectedElementIDSet)
  }

  public get getSelectedPropsIfUnique(): ElementProps | null {
    if (this.selectedElementIDSet.size === 1) {
      const unique = [...this.selectedElementIDSet.values()][0]
      const module = this.editor.elementManager.all.get(unique)

      if (module) {
        return module.toMinimalJSON()
      }

      return null
    }
    return null
  }

  public selectAll(): void {
    this.selectedElementIDSet = this.editor.elementManager.keys
  }

  public modifySelected(idSet: Set<UID>, action: SelectionActionMode) {
    modifySelected.call(this, idSet, action)
  }

  public addSelected(idSet: Set<UID>) {
    modifySelected.call(this, idSet, 'add')
  }

  public deleteSelected(idSet: Set<UID>) {
    modifySelected.call(this, idSet, 'delete')
  }

  public toggleSelected(idSet: Set<UID>) {
    modifySelected.call(this, idSet, 'toggle')
  }

  public replaceSelected(idSet: Set<UID>) {
    modifySelected.call(this, idSet, 'replace')
  }

  destroy() {
    this.selectedElementIDSet.clear()
  }

}

export default Selection