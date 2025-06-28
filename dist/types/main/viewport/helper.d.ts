import Editor from '../editor';
import { ModuleInstance } from '../../core/modules/type';
import { UID } from '../../core/type';
import { Point, Rect } from '../../type';
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
