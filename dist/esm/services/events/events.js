class EventManager {
    editor;
    eventsController = new AbortController();
    dispatchEvent(domEvent, type, options) {
        const { overlayCanvasContext, baseCanvasContext, scale, dpr } = this.editor.world;
        const { clientX, clientY, pointerId } = domEvent;
        const elements = this.editor.visible.values.sort((a, b) => b.layer - a.layer);
        const x = clientX - this.editor.rect.x;
        const y = clientY - this.editor.rect.y;
        const viewPoint = {
            x: x * dpr,
            y: y * dpr,
        };
        for (const el of elements) {
            let stopped = false;
            const { path2D, fill } = el;
            const f1 = overlayCanvasContext.isPointInStroke(path2D, viewPoint.x, viewPoint.y);
            const f2 = overlayCanvasContext.isPointInPath(path2D, viewPoint.x, viewPoint.y);
            if (!f1 && (!f2 || !fill.enabled)) {
                continue;
            }
            // ctx.isPointInStroke()
            // let effectiveType = type
            /* if (
               type === 'mousemove' &&
               el.isNearPath?.(x, y, options?.tolerance)
             ) {
               effectiveType = 'onnearpath'
             }*/
            const event = {
                type,
                x,
                y,
                pointerId,
                originalEvent: domEvent,
                isPropagationStopped: false,
                stopPropagation() {
                    stopped = true;
                    event.isPropagationStopped = true;
                },
            };
            el.dispatchEvent?.(event);
            if (stopped) {
                domEvent.stopPropagation();
                domEvent.preventDefault();
                return true;
            }
        }
        return false;
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
