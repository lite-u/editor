import Editor from '~/main/editor';
import { BoundingRect, Point } from '~/type';
declare class World {
    editor: Editor;
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
    getWorldPointByViewportPoint(x: number, y: number): any;
    getViewPointByWorldPoint(x: number, y: number): any;
    renderOverlay(): void;
    destroy(): void;
}
export default World;
