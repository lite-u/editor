class Point {
  readonly x: number
  readonly y: number

  constructor(x, y) {

  }

  translate(x: number, y: number) {
    this.x += x
    this.y += y
  }

  render(ctx: CanvasRenderingContext2D) {

  }
}