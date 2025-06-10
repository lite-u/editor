export default function ellipseToBezierPoints(ellipse) {
    if (!ellipse) {
        throw new Error('Ellipse is null or undefined');
    }
    const { cx, cy, r1, r2, rotation = 0, startAngle = 0, endAngle = 360 } = ellipse;
    if (r1 <= 0 || r2 <= 0) {
        throw new Error('Radii must be positive numbers');
    }
    const toRad = (deg) => (deg * Math.PI) / 180;
    const rotationRad = toRad(rotation);
    let startRad = toRad(startAngle);
    let endRad = toRad(endAngle);
    // Normalize angles so end > start
    if (endRad <= startRad) {
        endRad += 2 * Math.PI;
    }
    const segmentAngle = Math.min(Math.PI / 2, endRad - startRad); // max 90 deg per segment
    // Number of segments
    const segments = Math.ceil((endRad - startRad) / segmentAngle);
    // Approximation constant for control points (approx 0.5522847 for circle)
    // Adjusted by radii for ellipse
    const K = 0.5522847498307936;
    // Rotate a point around center
    function rotatePoint(point, angle, center) {
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        return {
            x: center.x + dx * cosA - dy * sinA,
            y: center.y + dx * sinA + dy * cosA,
        };
    }
    // Calculate a point on ellipse at angle
    function ellipsePoint(angle) {
        return { x: cx + r1 * Math.cos(angle), y: cy + r2 * Math.sin(angle) };
    }
    // Calculate control points for segment from angle1 to angle2
    function controlPoints(angle1, angle2) {
        const delta = angle2 - angle1;
        const tanDeltaOver2 = Math.tan(delta / 2);
        // handle length for control points along tangent vector
        const alpha = (Math.sin(delta) * (Math.sqrt(4 + 3 * tanDeltaOver2 * tanDeltaOver2) - 1)) / 3;
        const p1 = ellipsePoint(angle1);
        const p2 = ellipsePoint(angle2);
        // Tangents at p1 and p2
        const t1 = { x: -r1 * Math.sin(angle1), y: r2 * Math.cos(angle1) };
        const t2 = { x: -r1 * Math.sin(angle2), y: r2 * Math.cos(angle2) };
        // Control points before rotation
        const cp1 = {
            x: p1.x + alpha * t1.x,
            y: p1.y + alpha * t1.y,
        };
        const cp2 = {
            x: p2.x - alpha * t2.x,
            y: p2.y - alpha * t2.y,
        };
        return { cp1, cp2 };
    }
    const points = [];
    for (let i = 0; i < segments; i++) {
        const angle1 = startRad + i * segmentAngle;
        const angle2 = Math.min(startRad + (i + 1) * segmentAngle, endRad);
        const anchor1 = rotatePoint(ellipsePoint(angle1), rotationRad, { x: cx, y: cy });
        const anchor2 = rotatePoint(ellipsePoint(angle2), rotationRad, { x: cx, y: cy });
        const { cp1, cp2 } = controlPoints(angle1, angle2);
        // Rotate control points
        const rcp1 = rotatePoint(cp1, rotationRad, { x: cx, y: cy });
        const rcp2 = rotatePoint(cp2, rotationRad, { x: cx, y: cy });
        if (i === 0) {
            // First anchor point, no cp1
            points.push({
                id: `anchor-${angle1}`,
                anchor: anchor1,
                cp1: null,
                cp2: rcp1,
                type: 'smooth',
            });
        }
        else {
            // The previous segment's cp2 was added already as cp1 of next segment
            points.push({
                id: `anchor-${angle1}`,
                anchor: anchor1,
                cp1: points[points.length - 1].cp2, // previous segment's cp2
                cp2: rcp1,
                type: 'smooth',
            });
        }
        if (i === segments - 1) {
            // Last anchor
            points.push({
                id: `anchor-${angle2}`,
                anchor: anchor2,
                cp1: rcp2,
                cp2: null,
                type: 'smooth',
            });
        }
    }
    return points;
}
