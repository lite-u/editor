import {ResizeDirection} from '~/services/selection/type'
import Editor from '~/main/editor'
import {Point} from '~/type'

export type CursorResizes = ResizeDirection
export type CursorType =
  'default'
  | 'grab'
  | 'grabbing'
  | 'rotate'
  | 'resize'
  | 'move'
  | 'not-allowed'
  | 'move-up'
  | 'move-down'

class Cursor {
  domRef: HTMLElement
  editor: Editor

  constructor(editor: Editor) {
    this.editor = editor
    this.domRef = document.createElement('div')
  }

  set(cursor: CursorType) {
    console.log('set cursor', cursor)
  }

  move(p: Point, rotation?: number) {
    console.log('set cursor', p)
  }

  grab() {}

  grabbing() {}

  default() {}

  destroy() {
    this.domRef.remove()
    this.domRef = null!
  }
}

export default Cursor
