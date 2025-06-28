import { ResizeDirection } from '~/services/selection/type';
import Editor from '~/main/editor';
import { Point } from '~/type';
export type CursorResizes = ResizeDirection;
export type CursorName = CSSStyleDeclaration['cursor'] | 'rotate';
declare class Cursor {
    domRef: HTMLElement;
    editor: Editor;
    EC: AbortController;
    _cursorForRecover: null;
    private locked;
    constructor(editor: Editor);
    set(name: CursorName): void;
    lock(): void;
    unlock(): void;
    move(p: Point): void;
    rotate(rotation: number): void;
    show(): void;
    hide(): void;
    destroy(): void;
}
export default Cursor;
