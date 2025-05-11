import {UID} from '~/core/core'
import Editor from '~/main/editor'
import {SelectionActionMode} from '~/services/selection/type'
import {selectionHelper} from './selectionHelper'
import {ElementProps} from '~/elements/elements'

class SelectionManager {
  protected selected: Set<UID> = new Set()
  editor: Editor

  constructor(editor: Editor) {
    this.editor = editor
  }

  public has(id: UID): boolean {
    return this.selected.has(id)
  }

  public get size(): number {
    return this.selected.size
  }

  public get values(): Set<UID> {
    return new Set(this.selected)
  }

  public clear() {
    this.selected.clear()
  }

  public get pickIfUnique(): ElementProps | null {
    if (this.selected.size === 1) {
      const unique = [...this.selected.values()][0]
      const module = this.editor.elementManager.all.get(unique)

      if (module) {
        return module.toMinimalJSON()
      }

      return null
    }
    return null
  }

  public selectAll(): void {
    this.selected = this.editor.elementManager.keys
  }

  public modify(idSet: Set<UID>, action: SelectionActionMode) {
    selectionHelper.call(this, idSet, action)
    switch (action) {
      case 'add':
        this.add(idSet)
        break
      case 'delete':
        this.delete(idSet)
        break
      case 'toggle':
        this.toggle(idSet)
        break
      case 'replace':
        this.replace(idSet)
        break
    }
  }

  public add(idSet: Set<UID>) {
    idSet.forEach(id => {
      this.selected.add(id)
    })
  }

  public delete(idSet: Set<UID>) {
    idSet.forEach(id => {
      this.selected.delete(id)
    })
  }

  public toggle(idSet: Set<UID>) {
    idSet.forEach(id => {
      if (this.selected.has(id)) {
        this.selected.delete(id)
      } else {
        this.selected.add(id)
      }
    })
  }

  public replace(idSet: Set<UID>) {
    this.clear()
    this.selected = idSet
  }

  destroy() {
    this.selected.clear()
  }
}

export default SelectionManager