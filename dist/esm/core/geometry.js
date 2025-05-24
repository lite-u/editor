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
export function isPointNear(p1, p2, tolerance = 3) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distanceSquared = dx * dx + dy * dy;
    return distanceSquared <= tolerance * tolerance;
}
export function nearestPointOnCurve(anchor, cp1, cp2, nextAnchor, target, steps = 100) {
    function lerp(p1, p2, t) {
        return {
            x: p1.x + (p2.x - p1.x) * t,
            y: p1.y + (p2.y - p1.y) * t,
        };
    }
    function cubicBezier(t, cp1, cp2) {
        const u = 1 - t;
        return {
            x: u ** 3 * anchor.x +
                3 * u ** 2 * t * cp1.x +
                3 * u * t ** 2 * cp2.x +
                t ** 3 * nextAnchor.x,
            y: u ** 3 * anchor.y +
                3 * u ** 2 * t * cp1.y +
                3 * u * t ** 2 * cp2.y +
                t ** 3 * nextAnchor.y,
        };
    }
    function quadraticBezier(t) {
        const u = 1 - t;
        return {
            x: u ** 2 * anchor.x +
                2 * u * t * (cp1?.x ?? anchor.x) +
                t ** 2 * nextAnchor.x,
            y: u ** 2 * anchor.y +
                2 * u * t * (cp1?.y ?? anchor.y) +
                t ** 2 * nextAnchor.y,
        };
    }
    function linear(t) {
        return lerp(anchor, nextAnchor, t);
    }
    let minDistSq = Infinity;
    let closest = anchor;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        let pt;
        if (cp1 && cp2) {
            pt = cubicBezier(t, cp1, cp2);
        }
        else if (cp1) {
            pt = quadraticBezier(t);
        }
        else if (cp2) {
            const mirrored = {
                x: nextAnchor.x * 2 - cp2.x,
                y: nextAnchor.y * 2 - cp2.y,
            };
            pt = cubicBezier(t, mirrored, cp2);
        }
        else {
            pt = linear(t);
        }
        const dx = pt.x - target.x;
        const dy = pt.y - target.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < minDistSq) {
            minDistSq = distSq;
            closest = pt;
        }
    }
    return closest;
}
