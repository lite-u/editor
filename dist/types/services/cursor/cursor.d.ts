import { ResizeDirection } from '~/services/selection/type';
import Editor from '~/main/editor';
import { Point } from '~/type';
export type CursorResizes = ResizeDirection;
export type CursorName = 'default' | 'grab' | 'grabbing' | 'rotate' | 'resize' | 'move' | 'not-allowed' | 'move-up' | 'move-down';
declare class Cursor {
    domRef: HTMLElement;
    editor: Editor;
    constructor(editor: Editor);
    set(name: CursorName): void;
    move(p: Point, rotation?: number): void;
    rotate(rotation: number): void;
    grab(): void;
    grabbing(): void;
    default(): void;
    destroy(): void;
}
export default Cursor;
