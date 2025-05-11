import { ResizeDirection } from '~/services/selection/type';
import Editor from '~/main/editor';
export type CursorResizes = ResizeDirection;
export type CursorType = 'default' | 'grab' | 'grabbing' | 'rotate' | 'resize' | 'move' | 'not-allowed' | 'move-up' | 'move-down';
declare class Cursor {
    domRef: HTMLElement;
    editor: Editor;
    constructor(editor: Editor);
    set(cursor: CursorType): void;
    grab(): void;
    grabbing(): void;
    default(): void;
    destroy(): void;
}
export default Cursor;
