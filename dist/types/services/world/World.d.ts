import Editor from '~/main/editor';
import { BoundingRect, Point } from '~/type';
declare class World {
    editor: Editor;
    baseCanvas: HTMLCanvasElement;
    baseCanvasContext: CanvasRenderingContext2D;
    overlayCanvas: HTMLCanvasElement;
    overlayCanvasContext: CanvasRenderingContext2D;
    creationCanvas: HTMLCanvasElement;
    creationCanvasContext: CanvasRenderingContext2D;
    scale: number;
    offset: {
        x: number;
        y: number;
    };
    worldRect: BoundingRect;
    dpr: number;
    constructor(editor: Editor);
    updateWorldRect(): void;
    zoom(zoom: number, point?: Point): {
        x: number;
        y: number;
    };
    getWorldPointByViewportPoint(x: number, y: number): {
        x: number;
        y: number;
    };
    getViewPointByWorldPoint(x: number, y: number): {
        x: number;
        y: number;
    };
    renderElements(): void;
    renderOverlay(): void;
    destroy(): void;
}
export default World;
