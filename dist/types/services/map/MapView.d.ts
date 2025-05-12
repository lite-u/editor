import Editor from '~/main/editor';
import { BoundingRect } from '~/type';
declare class MapView {
    editor: Editor;
    mainCanvas: HTMLCanvasElement;
    mainCanvasContext: CanvasRenderingContext2D;
    selectionCanvas: HTMLCanvasElement;
    selectionCanvasContext: CanvasRenderingContext2D;
    offset: {
        x: number;
        y: number;
    };
    scale: number;
    worldRect: BoundingRect;
    constructor(editor: Editor);
    destroy(): void;
    renderModules(): void;
}
export default MapView;
