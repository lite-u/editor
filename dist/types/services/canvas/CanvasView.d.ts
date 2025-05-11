declare class CanvasView {
    mainCanvas: HTMLCanvasElement;
    mainCanvasContext: CanvasRenderingContext2D;
    selectionCanvas: HTMLCanvasElement;
    selectionCanvasContext: CanvasRenderingContext2D;
    constructor();
    destroy(): void;
}
export default CanvasView;
