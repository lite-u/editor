class EventManager {
    editor;
    eventsController = new AbortController();
    dispatchEvent(domEvent, type, options) {
        const { offsetX: x, offsetY: y, pointerId } = domEvent;
        const elements = this.editor.visible.values.sort((a, b) => a.layer - b.layer);
        for (const el of elements) {
            let stopped = false;
            let effectiveType = type;
            if (type === 'mousemove' &&
                el.isNearPath?.(x, y, options?.tolerance)) {
                effectiveType = 'onnearpath';
            }
            const event = {
                type: effectiveType,
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
