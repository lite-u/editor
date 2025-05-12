import Editor from '~/main/editor';
declare class CanvasView {
    editor: Editor;
    mainCanvas: HTMLCanvasElement;
    mainCanvasContext: CanvasRenderingContext2D;
    selectionCanvas: HTMLCanvasElement;
    selectionCanvasContext: CanvasRenderingContext2D;
    dpr: number;
    constructor(editor: Editor, dpr: number);
    destroy(): void;
    renderModules(): void;
}
export default CanvasView;
