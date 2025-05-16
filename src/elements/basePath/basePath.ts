type Point = { x: number; y: number };

export class BasePath {
  protected getPoints(): Point[] {return []}

/*
  protected setPoints(_: Point[]): void {
    return undefined
  }
*/

  getCenter(): Point {
    const points = this.getPoints()
    const xs = points.map(p => p.x)
    const ys = points.map(p => p.y)
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2
    return {x: cx, y: cy}
  }
/*
  applyMatrix(matrix: DOMMatrix) {
    const transformed = this.getPoints().map(p => matrix.transformPoint(p))
    this.setPoints(transformed)
  }

  translate(dx: number, dy: number) {
    const matrix = new DOMMatrix().translate(dx, dy)
    this.applyMatrix(matrix)
  }

  rotate(angle: number, center?: Point) {
    const pivot = center ?? this.getCenter()
    const matrix = new DOMMatrix()
      .translate(pivot.x, pivot.y)
      .rotate(angle)
      .translate(-pivot.x, -pivot.y)
    this.applyMatrix(matrix)
  }

  scale(sx: number, sy: number, center?: Point) {
    const pivot = center ?? this.getCenter()
    const matrix = new DOMMatrix()
      .translate(pivot.x, pivot.y)
      .scale(sx, sy)
      .translate(-pivot.x, -pivot.y)
    this.applyMatrix(matrix)
  }*/
}