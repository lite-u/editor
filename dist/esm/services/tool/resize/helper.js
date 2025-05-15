export const getBoundingRectFromBoundingRects = (list) => {
    if (list.length === 0) {
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            cx: 0,
            cy: 0,
        };
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    list.forEach((rect) => {
        minX = Math.min(minX, rect.x);
        minY = Math.min(minY, rect.y);
        maxX = Math.max(maxX, rect.x + rect.width);
        maxY = Math.max(maxY, rect.y + rect.height);
    });
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        top: minY,
        bottom: maxY,
        left: minX,
        right: maxX,
        cx: minX + (maxX - minX) / 2,
        cy: minY + (maxY - minY) / 2,
    };
};
export const getAnchorsByResizeDirection = (r, d) => {
    const map = {
        tl: [{ x: r.left, y: r.top }, { x: r.right, y: r.bottom }],
        t: [{ x: r.cx, y: r.top }, { x: r.cx, y: r.bottom }],
        tr: [{ x: r.right, y: r.top }, { x: r.left, y: r.bottom }],
        r: [{ x: r.right, y: r.cy }, { x: r.left, y: r.cy }],
        br: [{ x: r.right, y: r.bottom }, { x: r.left, y: r.top }],
        b: [{ x: r.cx, y: r.bottom }, { x: r.cx, y: r.top }],
        bl: [{ x: r.left, y: r.bottom }, { x: r.right, y: r.top }],
        l: [{ x: r.left, y: r.cy }, { x: r.right, y: r.cy }],
    };
    const [anchor, opposite] = map[d] ?? [{ x: r.cx, y: r.cy }, { x: r.cx, y: r.cy }];
    return { anchor, opposite };
};
