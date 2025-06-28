import Editor from '../editor';
import { ResizeDirection } from '../selection/type';
import { UID } from '../../core/type';
import { Point, Rect } from '../../type';
export interface InitViewportDomReturn {
    wrapper: HTMLDivElement;
    selectionBox: HTMLDivElement;
    mainCanvas: HTMLCanvasElement;
    selectionCanvas: HTMLCanvasElement;
    scrollBarX: HTMLDivElement;
    scrollBarY: HTMLDivElement;
    cursor: HTMLDivElement;
}
export declare function initViewportDom(id: UID): InitViewportDomReturn;
export declare const updateScrollBars: (scrollBarX: HTMLDivElement, scrollBarY: HTMLDivElement) => void;
export declare const updateSelectionBox: (selectionBox: HTMLDivElement, { x, y, height, width }: Rect, show?: boolean) => void;
export declare function updateCursor(this: Editor, type: 'rotate' | 'resize' | 'default' | 'grabbing', position?: Point | ResizeDirection, angle?: number): void;
