/** Convert screen (mouse) coordinates to canvas coordinates */
export function screenToWorld(point, offset, scale, dpr) {
    return {
        x: (point.x * dpr - offset.x) / scale,
        y: (point.y * dpr - offset.y) / scale,
    };
}
/** Convert canvas coordinates to screen coordinates */
export function worldToScreen(point, offset, scale, dpr) {
    /*
    *
    x: canvasX * scale + offsetX,
    y: canvasY * scale + offsetY,
    * */
    return {
        x: ((point.x * scale) + offset.x) / dpr,
        y: ((point.y * scale) + offset.y) / dpr,
    };
}
/*

export const drawCrossLine = ({
                                ctx,
                                mousePoint,
                                scale,
                                dpr,
                                offset,
                                virtualRect: {left: minX, top: minY, right: maxX, bottom: maxY},
                              }: DrawCrossLineProps): void => {
  const textOffsetX = 10 / (dpr * scale)
  const textOffsetY = 10 / (dpr * scale)
  const {x, y} = screenToWorld(
    mousePoint,
    offset,
    scale,
    dpr,
  )
  const crossLineColor = '#ff0000'
  const textColor = '#ff0000'
  const textShadowColor = '#000'

  ctx.save()
  ctx.textBaseline = 'alphabetic'
  ctx.font = `${24 / scale}px sans-serif`
  // ctx.setLineDash([3 * dpr * scale, 5 * dpr * scale])
  ctx.fillStyle = textColor
  ctx.shadowColor = crossLineColor
  ctx.shadowBlur = 1

  ctx.fillText(
    `${Math.floor(x)}, ${Math.floor(y)}`,
    x + textOffsetX,
    y - textOffsetY,
    200 / scale,
  )
  ctx.lineWidth = 2 / (dpr * scale)
  ctx.strokeStyle = crossLineColor
  ctx.shadowColor = textShadowColor
  ctx.shadowBlur = 0
  ctx.beginPath()
  ctx.moveTo(minX, y)
  ctx.lineTo(maxX, y)
  ctx.moveTo(x, minY)
  ctx.lineTo(x, maxY)
  ctx.stroke()
  ctx.restore()
}
*/
export const areSetsEqual = (setA, setB) => {
    if (setA.size !== setB.size)
        return false;
    for (const item of setA) {
        if (!setB.has(item))
            return false;
    }
    return true;
};
export const getSymmetricDifference = (setA, setB) => {
    const result = new Set();
    for (const item of setA) {
        if (!setB.has(item))
            result.add(item);
    }
    for (const item of setB) {
        if (!setA.has(item))
            result.add(item);
    }
    return result;
};
export function removeIntersectionAndMerge(setA, setB) {
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const uniqueA = new Set([...setA].filter(x => !intersection.has(x)));
    const uniqueB = new Set([...setB].filter(x => !intersection.has(x)));
    return new Set([...uniqueA, ...uniqueB]);
}
export const deduplicateObjectsByKeyValue = (objects) => {
    if (!Array.isArray(objects))
        return [];
    const seen = new Set();
    return objects.filter((item) => {
        const key = Object.keys(item)
            .sort()
            .map(key => `${key}:${String(item[key])}`)
            .join(';');
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
};
export const createWith = (tagName, style) => {
    const dom = document.createElement(tagName);
    // dom.setAttribute(role, '')
    if (style) {
        Object.assign(dom.style, style);
    }
    return dom;
};
export const setStyle = (dom, styles) => {
    Object.assign(dom.style, styles);
};
export const isEqual = (o1, o2) => {
    if (o1 === o2)
        return true;
    if (typeof o1 !== typeof o2)
        return false;
    if (typeof o1 === 'object' && o1 !== null && o2 !== null) {
        const keys1 = Object.keys(o1);
        const keys2 = Object.keys(o2);
        if (keys1.length !== keys2.length)
            return false;
        for (const key of keys1) {
            if (!(key in o2))
                return false;
            if (!isEqual(o1[key], o2[key]))
                return false;
        }
        return true;
    }
    return false;
};
