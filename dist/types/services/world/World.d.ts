import Editor from '~/main/editor';
import { BoundingRect, Point } from '~/type';
declare class World {
    editor: Editor;
    mainCanvas: HTMLCanvasElement;
    mainCanvasContext: CanvasRenderingContext2D;
    selectionCanvas: HTMLCanvasElement;
    selectionCanvasContext: CanvasRenderingContext2D;
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
    renderModules(): void;
    renderSelections(): void;
    destroy(): void;
}
export default World;
