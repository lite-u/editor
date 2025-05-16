export type PointProps = {
  type?: 'point'
  id: string
  x: number
  y: number
}

class Point {
  readonly type = 'point'
  private id: string
  private x: number
  private y: number

  constructor({id, x, y}: PointProps) {

    this.x = x
    this.y = y
  }

  translate(x: number, y: number) {
    this.x += x
    this.y += y
  }

  render(ctx: CanvasRenderingContext2D) {

  }

  getJSON() {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
    }
  }

  getMinimalJSON() {}
}