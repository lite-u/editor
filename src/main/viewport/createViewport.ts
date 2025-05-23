import {initViewportDom, InitViewportDomReturn} from './domManipulations'
import Editor from '../editor'
import {Viewport} from './type'
import {generateBoundingRectFromTwoPoints, throttle} from '../../core/utils'
import handleMouseDown from './eventHandlers/mouseDown'
import handleMouseUp from './eventHandlers/mouseUp'
import handleKeyDown from './eventHandlers/keyDown'
import handleKeyUp from './eventHandlers/keyUp'
import handleWheel from './eventHandlers/wheel'
import handlePointerMove from './eventHandlers/pointerMove'
import handleContextMenu from './eventHandlers/contextMenu'
import Rectangle from '../../core/modules/shapes/rectangle'

export function createViewport(this: Editor): Viewport {
  const {
    wrapper,
    mainCanvas,
    selectionCanvas,
    selectionBox,
    scrollBarX,
    scrollBarY,
    cursor,
  }: InitViewportDomReturn = initViewportDom(this.id)
  const selectionCTX = selectionCanvas.getContext(
    '2d',
  ) as CanvasRenderingContext2D
  const mainCTX = mainCanvas.getContext('2d') as CanvasRenderingContext2D
  const eventsController = new AbortController()
  const resizeObserver = new ResizeObserver(
    throttle(() => {
      this.action.dispatch('world-resized')
    }, 200),
  )
  const {signal} = eventsController
  const mouseDownPoint = {x: 0, y: 0}
  const mouseMovePoint = {x: 0, y: 0}
  const rect = generateBoundingRectFromTwoPoints(
    mouseDownPoint,
    mouseMovePoint,
  )
  const viewportRect = generateBoundingRectFromTwoPoints(
    mouseDownPoint,
    mouseMovePoint,
  )
  const worldRect = generateBoundingRectFromTwoPoints(
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

  return {
    drawCrossLine: false,
    drawCrossLineDefault: false,
    enableCrossLine: false,
    // handlingModules: undefined,
    // hoveredModules: undefined,
    initialized: false,
    // manipulationStatus: undefined,
    scale: 1,
    spaceKeyDown: false,
    zooming: false,
    dpr: this.config.dpr,
    frame: new Rectangle({...this.config.frame}),
    offset: {x: 0, y: 0},
    viewportRect,
    worldRect,
    mouseDownPoint,
    mouseMovePoint,
    rect,
    wrapper,
    mainCanvas,
    selectionCanvas,
    selectionCTX,
    mainCTX,
    scrollBarX,
    scrollBarY,
    selectionBox,
    cursor,
    resizeObserver,
    eventsController,
  }
}
