export class BasePath {
    get getPoints() { return []; }
    /*
      protected setPoints(_: Point[]): void {
        return undefined
      }
    */
    getCenter() {
        const points = this.getPoints();
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
        const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
        return { x: cx, y: cy };
    }
}
