class EventManager {
    editor;
    eventsController = new AbortController();
    _hoveredElement = null;
    dispatchEvent(domEvent, type, options) {
        const { baseCanvasContext, overlayCanvasContext, dpr } = this.editor.world;
        const { clientX, clientY, pointerId } = domEvent;
        const elements = this.editor.visible.values.sort((a, b) => b.layer - a.layer);
        const x = clientX - this.editor.rect.x;
        const y = clientY - this.editor.rect.y;
        const viewPoint = {
            x: x * dpr,
            y: y * dpr,
        };
        let _ele = null;
        for (const el of elements) {
            // let stopped = false
            const { path2D, fill } = el;
            const f1 = baseCanvasContext.isPointInStroke(path2D, viewPoint.x, viewPoint.y);
            const f2 = baseCanvasContext.isPointInPath(path2D, viewPoint.x, viewPoint.y);
            if (f1 || (f2 && fill.enabled)) {
                _ele = el;
                break;
            }
        }
        if (type === 'mousemove') {
            if (this._hoveredElement !== _ele) {
                // mouseleave for old
                this._hoveredElement?.dispatchEvent?.({
                    type: 'mouseleave',
                    x,
                    y,
                    pointerId,
                    originalEvent: domEvent,
                    isPropagationStopped: false,
                    stopPropagation() { },
                });
                // mouseenter for new
                _ele?.dispatchEvent?.({
                    type: 'mouseenter',
                    x,
                    y,
                    pointerId,
                    originalEvent: domEvent,
                    isPropagationStopped: false,
                    stopPropagation() { },
                });
                this._hoveredElement = _ele;
            }
        }
        if (!_ele)
            return;
        const event = {
            type,
            x,
            y,
            pointerId,
            originalEvent: domEvent,
            isPropagationStopped: false,
            stopPropagation() {
                event.isPropagationStopped = true;
            },
        };
        _ele.dispatchEvent?.(event);
        /*
            if (stopped) {
              domEvent.stopPropagation()
              domEvent.preventDefault()
              return true
            }*/
    }
    constructor(editor) {
        const { signal } = this.eventsController;
        const { container } = editor;
        this.editor = editor;
        container.addEventListener('pointerdown', e => this.dispatchEvent(e, 'mousedown'), { signal, passive: false });
        container.addEventListener('pointerup', e => this.dispatchEvent(e, 'mouseup'), { signal });
        container.addEventListener('pointermove', e => this.dispatchEvent(e, 'mousemove'), { signal });
        // container.addEventListener('contextmenu', e => this.dispatchPointerEvent(e, 'contextmenu'), { signal })
    }
    destroy() {
        this.eventsController.abort();
    }
}
export default EventManager;
