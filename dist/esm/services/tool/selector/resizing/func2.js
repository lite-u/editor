export function scaleElementFrom(element, scaleX, scaleY, anchor) {
    const transform = new DOMMatrix()
        .translate(anchor.x, anchor.y)
        .scale(scaleX, scaleY)
        .translate(-anchor.x, -anchor.y);
    switch (element.type) {
        case 'rect': {
            const halfW = element.width / 2;
            const halfH = element.height / 2;
            const p1 = transformPoint({ x: element.cx - halfW, y: element.cy - halfH }, transform);
            const p2 = transformPoint({ x: element.cx + halfW, y: element.cy + halfH }, transform);
            element.cx = (p1.x + p2.x) / 2;
            element.cy = (p1.y + p2.y) / 2;
            element.width = Math.abs(p2.x - p1.x);
            element.height = Math.abs(p2.y - p1.y);
            break;
        }
        case 'ellipse': {
            const rxVec = transformPoint({ x: element.cx + element.rx, y: element.cy }, transform);
            const ryVec = transformPoint({ x: element.cx, y: element.cy + element.ry }, transform);
            const center = transformPoint({ x: element.cx, y: element.cy }, transform);
            element.rx = Math.abs(rxVec.x - center.x);
            element.ry = Math.abs(ryVec.y - center.y);
            element.cx = center.x;
            element.cy = center.y;
            break;
        }
        case 'line': {
            const newStart = transformPoint(element.start, transform);
            const newEnd = transformPoint(element.end, transform);
            element.start = newStart;
            element.end = newEnd;
            element.cx = (newStart.x + newEnd.x) / 2;
            element.cy = (newStart.y + newEnd.y) / 2;
            break;
        }
        case 'path': {
            element.points = element.points.map((pt) => transformPoint(pt, transform));
            const bbox = getBoundingBox(element.points);
            element.cx = (bbox.minX + bbox.maxX) / 2;
            element.cy = (bbox.minY + bbox.maxY) / 2;
            break;
        }
    }
    element.updatePath2D();
}
function transformPoint(p, m) {
    const r = m.transformPoint(p);
    return { x: r.x, y: r.y };
}
function getBoundingBox(points) {
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    return {
        minX: Math.min(...xs),
        maxX: Math.max(...xs),
        minY: Math.min(...ys),
        maxY: Math.max(...ys),
    };
}
