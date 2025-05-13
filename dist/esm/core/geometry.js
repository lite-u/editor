/*
const rotatePointAroundPoint = (p1: Point, p2: Point, rotation: number) => {

}

export default rotatePointAroundPoint
*/
export function rotatePointAroundPoint(px, py, cx, cy, rotation) {
    const dx = px - cx;
    const dy = py - cy;
    const angle = rotation * (Math.PI / 180);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: cx + dx * cos - dy * sin,
        y: cy + dx * sin + dy * cos,
    };
}
export function transformPoints(points, matrix) {
    return points.map(p => matrix.transformPoint(p));
}
export function getCornerByRect(rect) {
}
