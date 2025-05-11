class CanvasView {
  mainCanvas: HTMLCanvasElement
  mainCanvasContext: CanvasRenderingContext2D
  selectionCanvas: HTMLCanvasElement
  selectionCanvasContext: CanvasRenderingContext2D

  constructor() {
    this.mainCanvas = document.createElement('canvas')
    this.mainCanvasContext = this.mainCanvas.getContext('2d') as CanvasRenderingContext2D

    this.selectionCanvas = document.createElement('canvas')
    this.selectionCanvasContext = this.selectionCanvas.getContext('2d') as CanvasRenderingContext2D
  }

  destroy() {
    this.mainCanvas.remove()
    this.selectionCanvas.remove()
    this.mainCanvas = null!
    this.selectionCanvas = null!
    this.mainCanvasContext = null!
    this.selectionCanvasContext = null!
  }
}

export default CanvasView