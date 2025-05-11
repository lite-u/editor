class CanvasView {
    mainCanvas;
    mainCanvasContext;
    selectionCanvas;
    selectionCanvasContext;
    constructor() {
        this.mainCanvas = document.createElement('canvas');
        this.mainCanvasContext = this.mainCanvas.getContext('2d');
        this.selectionCanvas = document.createElement('canvas');
        this.selectionCanvasContext = this.selectionCanvas.getContext('2d');
    }
    destroy() {
        this.mainCanvas.remove();
        this.selectionCanvas.remove();
        this.mainCanvas = null;
        this.selectionCanvas = null;
        this.mainCanvasContext = null;
        this.selectionCanvasContext = null;
    }
}
export default CanvasView;
