import Editor from '~/main/editor';
import { ElementInstance } from '~/elements/type';
declare class EventManager {
    editor: Editor;
    eventsController: AbortController;
    _hoveredElement: ElementInstance | null;
    dispatchEvent(domEvent: PointerEvent, type: PointerEvent['type'], options?: {
        tolerance?: number;
    }): void;
    constructor(editor: Editor);
    destroy(): void;
}
export default EventManager;
