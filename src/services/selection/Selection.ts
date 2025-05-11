import {UID} from '~/core/core'
import Editor from '~/engine/editor'

class Selection {
  protected selectedElementIDSet: Set<UID> = new Set()
  editor: Editor

  constructor(editor: Editor) {
    this.editor = editor
  }

  public get getSelected(): Set<UID> {
    return new Set(this.selectedElementIDSet)
  }

  public selectAll(): void {
    this.selectedElementIDSet = this.editor.elementManager.getAllIDSet()
  }

  destroy() {
    this.selectedElementIDSet.clear()
  }

}

export default Selection