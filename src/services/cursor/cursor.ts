import {ResizeDirection} from '~/services/selection/type'
import Editor from '~/main/editor'
import {Point} from '~/type'
import {createWith} from '~/lib/lib'

export type CursorResizes = ResizeDirection
export type CursorName =
  'default'
  | 'grab'
  | 'grabbing'
  | 'rotate'
  | 'resize'
  | 'move'
  | 'not-allowed'
  | 'move-up'
  | 'move-down'

const CURSORS: Record<CursorName, string> = {
  default: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
    <path d="M2,2 L14,14 M14,2 L2,14" stroke="black" stroke-width="2"/>
  </svg>`,

  grab: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
    <circle cx="8" cy="8" r="6" stroke="black" stroke-width="2" fill="none"/>
    <line x1="5" y1="5" x2="11" y2="11" stroke="black" stroke-width="2"/>
  </svg>`,

  grabbing: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
    <rect x="4" y="4" width="8" height="8" stroke="black" stroke-width="2" fill="none"/>
    <line x1="4" y1="4" x2="12" y2="12" stroke="black" stroke-width="2"/>
  </svg>`,

  rotate: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
    <path d="M8,2 A6,6 0 1,1 7.99,2" stroke="black" stroke-width="2" fill="none"/>
    <polygon points="8,0 10,4 6,4" fill="black"/>
  </svg>`,

  resize: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
    <line x1="2" y1="2" x2="14" y2="14" stroke="black" stroke-width="2"/>
    <line x1="14" y1="2" x2="2" y2="14" stroke="black" stroke-width="2"/>
  </svg>`,

  move: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
    <polygon points="8,0 10,4 6,4" fill="black"/>
    <polygon points="8,16 10,12 6,12" fill="black"/>
    <polygon points="0,8 4,6 4,10" fill="black"/>
    <polygon points="16,8 12,6 12,10" fill="black"/>
  </svg>`,

  'not-allowed': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
    <circle cx="8" cy="8" r="6" stroke="black" stroke-width="2" fill="none"/>
    <line x1="4" y1="4" x2="12" y2="12" stroke="black" stroke-width="2"/>
  </svg>`,

  'move-up': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
    <polygon points="8,0 12,6 4,6" fill="black"/>
  </svg>`,

  'move-down': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
    <polygon points="8,16 12,10 4,10" fill="black"/>
  </svg>`,
}

class Cursor {
  domRef: HTMLElement
  editor: Editor

  constructor(editor: Editor) {
    this.editor = editor
    this.domRef = createWith('div', 'cursor', editor.id, {
      pointerEvents: 'none',
      width: '20px',
      height: '20px',
      position: 'absolute',
    })
    editor.container.appendChild(this.domRef)
  }

  set(name: CursorName) {
    // console.log('set cursor', cursor)
    this.domRef.innerHTML = CURSORS[name]
  }

  move(p: Point, rotation?: number) {
    // console.log('set cursor', p)
  }

  rotate(rotation: number) {
    // const size = 24
    // const offset = size / 2
    // const {x, y} = position as Point

    // for svg icon direction
    rotation += 45

    // cursor.style.display = 'block'
    this.domRef.style.transformOrigin = 'center center'
    this.domRef.style.rotate = `${rotation}deg`
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
