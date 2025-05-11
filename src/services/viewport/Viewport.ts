import {initViewportDom, ViewportDomRefType} from '~/services/viewport/domManipulations'
import Editor from '~/main/editor'
import {generateBoundingRectFromTwoPoints, throttle} from '~/core/utils'
import handleMouseDown from '~/services/tools/eventHandlers/mouseDown'
import handleMouseUp from '~/services/tools/eventHandlers/mouseUp'
import handleKeyDown from '~/services/tools/eventHandlers/keyDown'
import handleKeyUp from '~/services/tools/eventHandlers/keyUp'
import handleWheel from '~/services/tools/eventHandlers/wheel'
import handlePointerMove from '~/services/tools/eventHandlers/pointerMove'
import handleContextMenu from '~/services/tools/eventHandlers/contextMenu'
import {BoundingRect} from '~/type'

export type ViewportManipulationType =
  | 'static'
  | 'waiting'
  | 'panning'
  | 'dragging'
  | 'resizing'
  | 'rotating'
  | 'zooming'
  | 'selecting'

class Viewport {
  editor: Editor
  refs: ViewportDomRefType
  // mainCTX: CanvasRenderingContext2D
  // selectionCTX: CanvasRenderingContext2D
  resizeObserver: ResizeObserver
  eventsController: AbortController
  initialized: boolean
  dpr: number
  spaceKeyDown: boolean
  // zooming: boolean
  rect: BoundingRect
  viewportRect: BoundingRect
  worldRect: BoundingRect
  offset: { x: number, y: number }
  scale: number
  enableCrossLine: boolean = false
  drawCrossLineDefault: boolean = false
  drawCrossLine: boolean = false

  constructor(editor: Editor) {
    const id = editor.id
    this.editor = editor
    this.refs = initViewportDom(id)
    const {
      // mainCanvas,
      // selectionCanvas,
      wrapper,
      // selectionBox,
      // cursor,
      // scrollBarY,
      // scrollBarX,
    } = this.refs
    // this.selectionCTX = selectionCanvas.getContext('2d') as CanvasRenderingContext2D
    // this.mainCTX = mainCanvas.getContext('2d') as CanvasRenderingContext2D
    this.eventsController = new AbortController()
    this.resizeObserver = new ResizeObserver(
      throttle(() => {
        // console.log('resize')
        this.editor.action.dispatch('world-resized')
      }, 200),
    )
    const {signal} = this.eventsController
    const mouseDownPoint = {x: 0, y: 0}
    const mouseMovePoint = {x: 0, y: 0}
    this.rect = generateBoundingRectFromTwoPoints(
      mouseDownPoint,
      mouseMovePoint,
    )
    this.viewportRect = generateBoundingRectFromTwoPoints(
      mouseDownPoint,
      mouseMovePoint,
    )
    this.worldRect = generateBoundingRectFromTwoPoints(
      mouseDownPoint,
      mouseMovePoint,
    )

    wrapper.addEventListener('mousedown', handleMouseDown.bind(this), {
      signal,
      passive: false,
    })
    wrapper.addEventListener('mouseup', handleMouseUp.bind(this), {signal})
    window.addEventListener('keydown', handleKeyDown.bind(this), {signal})
    window.addEventListener('keyup', handleKeyUp.bind(this), {signal})
    window.addEventListener('wheel', handleWheel.bind(this), {
      signal,
      passive: false,
    })
    wrapper.addEventListener('pointermove', handlePointerMove.bind(this), {
      signal,
    })
    wrapper.addEventListener('contextmenu', handleContextMenu.bind(this), {
      signal,
    })
  }

  destroy() {
    this.resizeObserver.disconnect()
    this.eventsController.abort()
    this.refs.wrapper.style.width = '100%'
    this.refs.wrapper.style.height = '100%'
    this.refs.wrapper.remove()
  }
}

export default Viewport