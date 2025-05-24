import Editor from '~/main/editor'
import {ElementInstance} from '~/elements/type'

class EventManager {
  editor: Editor
  eventsController = new AbortController()
  _hoveredElement: ElementInstance | null = null

  dispatchEvent(domEvent: PointerEvent, type: PointerEvent['type'], options?: { tolerance?: number }) {
    const {baseCanvasContext, scale, dpr} = this.editor.world
    const {clientX, clientY, pointerId} = domEvent
    const elements = this.editor.visible.values.sort((a, b) => b.layer - a.layer)
    const x = clientX - this.editor.rect!.x
    const y = clientY - this.editor.rect!.y
    const viewPoint = {
      x: x * dpr,
      y: y * dpr,
    }

    for (const el of elements) {
      let stopped = false
      const {path2D, fill} = el

      const f1 = baseCanvasContext.isPointInStroke(path2D, viewPoint.x, viewPoint.y)
      const f2 = baseCanvasContext.isPointInPath(path2D, viewPoint.x, viewPoint.y)

      if (!f1 && (!f2 || !fill.enabled)) {
        continue
      }

      if (type === 'mousemove') {
        if (this._hoveredElement !== el) {
          // mouseleave for old
          if (this._hoveredElement) {
            this._hoveredElement.dispatchEvent?.({
              type: 'mouseleave',
              x,
              y,
              pointerId,
              originalEvent: domEvent,
              isPropagationStopped: false,
              stopPropagation() {}
            })
          }

          // mouseenter for new
          el.dispatchEvent?.({
            type: 'mouseenter',
            x,
            y,
            pointerId,
            originalEvent: domEvent,
            isPropagationStopped: false,
            stopPropagation() {}
          })

          this._hoveredElement = el
        }
      }
      // ctx.isPointInStroke()
      // let effectiveType = type

      /* if (
         type === 'mousemove' &&
         el.isNearPath?.(x, y, options?.tolerance)
       ) {
         effectiveType = 'onnearpath'
       }*/

      const event: ElementPointerEvent = {
        type,
        x,
        y,
        pointerId,
        originalEvent: domEvent,
        isPropagationStopped: false,
        stopPropagation() {
          stopped = true
          event.isPropagationStopped = true
        },
      }

      el.dispatchEvent?.(event)

      if (stopped) {
        domEvent.stopPropagation()
        domEvent.preventDefault()
        return true
      }
    }

/*    if (type === 'mousemove' && !this._hoveredElement) {
      if (this._hoveredElement !== null) {
        this._hoveredElement.dispatchEvent?.({
          type: 'mouseleave',
          x,
          y,
          pointerId,
          originalEvent: domEvent,
          isPropagationStopped: false,
          stopPropagation() {}
        })
        this._hoveredElement = null
      }
    }*/

    return false
  }

  constructor(editor: Editor) {
    const {signal} = this.eventsController
    const {container} = editor
    this.editor = editor

    container.addEventListener('pointerdown', e => this.dispatchEvent(e, 'mousedown'), {signal, passive: false})
    container.addEventListener('pointerup', e => this.dispatchEvent(e, 'mouseup'), {signal})
    container.addEventListener('pointermove', e => this.dispatchEvent(e, 'mousemove'), {signal})
    // container.addEventListener('contextmenu', e => this.dispatchPointerEvent(e, 'contextmenu'), { signal })
  }

  destroy() {
    this.eventsController.abort()
  }
}

export default EventManager