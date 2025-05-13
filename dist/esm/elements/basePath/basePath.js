export class BasePath {
    getCenter() {
        const points = this.getPoints();
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
        const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
        return { x: cx, y: cy };
    }
    applyMatrix(matrix) {
        const transformed = this.getPoints().map(p => matrix.transformPoint(p));
        this.setPoints(transformed);
    }
    translate(dx, dy) {
        const matrix = new DOMMatrix().translate(dx, dy);
        this.applyMatrix(matrix);
    }
    rotate(angle, center) {
        const pivot = center ?? this.getCenter();
        const matrix = new DOMMatrix()
            .translate(pivot.x, pivot.y)
            .rotate(angle)
            .translate(-pivot.x, -pivot.y);
        this.applyMatrix(matrix);
    }
    scale(sx, sy, center) {
        const pivot = center ?? this.getCenter();
        const matrix = new DOMMatrix()
            .translate(pivot.x, pivot.y)
            .scale(sx, sy)
            .translate(-pivot.x, -pivot.y);
        this.applyMatrix(matrix);
    }
}
