import Editor from '~/main/editor';
import type { PointerEventType } from '~/types/event';
declare class EventManager {
    editor: Editor;
    eventsController: AbortController;
    dispatchEvent(domEvent: PointerEvent, type: PointerEventType, options?: {
        tolerance?: number;
    }): boolean;
    constructor(editor: Editor);
    destroy(): void;
}
export default EventManager;
