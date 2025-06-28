"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotatePointAroundPoint = rotatePointAroundPoint;
exports.transformPoints = transformPoints;
exports.isPointNear = isPointNear;
exports.nearestPointOnCurve = nearestPointOnCurve;
exports.cubicBezier = cubicBezier;
exports.getBoundingRectFromBezierPoints = getBoundingRectFromBezierPoints;
function rotatePointAroundPoint(px, py, cx, cy, rotation) {
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
function transformPoints(points, matrix) {
    return points.map(p => matrix.transformPoint(p));
}
function isPointNear(p1, p2, tolerance = 3) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distanceSquared = dx * dx + dy * dy;
    return distanceSquared <= tolerance * tolerance;
}
function nearestPointOnCurve(anchor, cp1, cp2, nextAnchor, target, steps = 100) {
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
        var _a, _b;
        const u = 1 - t;
        return {
            x: u ** 2 * anchor.x +
                2 * u * t * ((_a = cp1 === null || cp1 === void 0 ? void 0 : cp1.x) !== null && _a !== void 0 ? _a : anchor.x) +
                t ** 2 * nextAnchor.x,
            y: u ** 2 * anchor.y +
                2 * u * t * ((_b = cp1 === null || cp1 === void 0 ? void 0 : cp1.y) !== null && _b !== void 0 ? _b : anchor.y) +
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
function cubicBezier(t, p0, p1, p2, p3) {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;
    return {
        x: mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x,
        y: mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y,
    };
}
function getBoundingRectFromBezierPoints(points) {
    var _a, _b;
    const samplePoints = [];
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const p0 = prev.anchor;
        const p1 = (_a = prev.cp2) !== null && _a !== void 0 ? _a : prev.anchor;
        const p2 = (_b = curr.cp1) !== null && _b !== void 0 ? _b : curr.anchor;
        const p3 = curr.anchor;
        for (let t = 0; t <= 1; t += 0.05) {
            samplePoints.push(cubicBezier(t, p0, p1, p2, p3));
        }
    }
    if (points.length === 1) {
        samplePoints.push(points[0].anchor);
    }
    const xs = samplePoints.map(p => p.x);
    const ys = samplePoints.map(p => p.y);
    const left = xs.reduce((min, x) => Math.min(min, x), Infinity);
    const right = xs.reduce((max, x) => Math.max(max, x), -Infinity);
    const top = ys.reduce((min, y) => Math.min(min, y), Infinity);
    const bottom = ys.reduce((max, y) => Math.max(max, y), -Infinity);
    const width = right - left;
    const height = bottom - top;
    const x = left;
    const y = top;
    const cx = x + width / 2;
    const cy = y + height / 2;
    return { x, y, width, height, left, right, top, bottom, cx, cy };
}
