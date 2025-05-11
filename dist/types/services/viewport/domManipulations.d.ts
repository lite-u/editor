import Editor from '../../main/editor';
import { ResizeDirection } from '../selection/type';
import { Point, Rect, UID } from '~/type';
export interface ViewportDomRefType {
    wrapper: HTMLDivElement;
    mainCanvas: HTMLCanvasElement;
    selectionBox: HTMLDivElement;
    selectionCanvas: HTMLCanvasElement;
}
export declare function initViewportDom(id: UID): ViewportDomRefType;
export declare const updateScrollBars: (scrollBarX: HTMLDivElement, scrollBarY: HTMLDivElement) => void;
export declare const updateSelectionBox: (selectionBox: HTMLDivElement, { x, y, height, width }: Rect, show?: boolean) => void;
export declare function updateCursor(this: Editor, type: 'rotate' | 'resize' | 'default' | 'grabbing', position?: Point | ResizeDirection, angle?: number): void;
