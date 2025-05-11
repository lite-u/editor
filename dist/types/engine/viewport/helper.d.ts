import { ModuleInstance } from '~/elements/elements';
import { UID } from '~/core/core';
import { Point, Rect } from '~/type';
import Editor from '~/engine/editor';
type FrameType = 'A4' | 'A4L' | 'photo1';
export declare const createFrame: (p: FrameType, id: UID) => ModuleInstance;
export declare const fitRectToViewport: (rect: Rect, viewport: Rect, paddingScale?: number) => {
    scale: number;
    offsetX: number;
    offsetY: number;
};
export declare function zoomAtPoint(this: Editor, atPoint: Point, newScale: number): {
    x: number;
    y: number;
};
export {};
