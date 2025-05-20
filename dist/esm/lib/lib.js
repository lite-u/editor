import Rectangle from '../elements/rectangle/rectangle.js';
import { DEFAULT_STROKE } from '../elements/defaultProps.js';
import Ellipse from '../elements/ellipse/ellipse.js';
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
export const drawCrossLine = ({ ctx, mousePoint, scale, dpr, offset, virtualRect: { left: minX, top: minY, right: maxX, bottom: maxY }, }) => {
    const textOffsetX = 10 / (dpr * scale);
    const textOffsetY = 10 / (dpr * scale);
    const { x, y } = screenToWorld(mousePoint, offset, scale, dpr);
    const crossLineColor = '#ff0000';
    const textColor = '#ff0000';
    const textShadowColor = '#000';
    ctx.save();
    ctx.textBaseline = 'alphabetic';
    ctx.font = `${24 / scale}px sans-serif`;
    // ctx.setLineDash([3 * dpr * scale, 5 * dpr * scale])
    ctx.fillStyle = textColor;
    ctx.shadowColor = crossLineColor;
    ctx.shadowBlur = 1;
    ctx.fillText(`${Math.floor(x)}, ${Math.floor(y)}`, x + textOffsetX, y - textOffsetY, 200 / scale);
    ctx.lineWidth = 2 / (dpr * scale);
    ctx.strokeStyle = crossLineColor;
    ctx.shadowColor = textShadowColor;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(minX, y);
    ctx.lineTo(maxX, y);
    ctx.moveTo(x, minY);
    ctx.lineTo(x, maxY);
    ctx.stroke();
    ctx.restore();
};
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
/*
export function getResizeTransform(
  name: ResizeDirectionName,
  symmetric = false,
): ResizeTransform {
  const base = (() => {
    switch (name) {
      case 'tl':
        return {dx: -1, dy: -1, cx: 0.5, cy: 0.5}
      case 't':
        return {dx: 0, dy: -1, cx: 0.0, cy: 0.5}
      case 'tr':
        return {dx: 1, dy: -1, cx: -0.5, cy: 0.5}
      case 'r':
        return {dx: 1, dy: 0, cx: -0.5, cy: 0.0}
      case 'br':
        return {dx: 1, dy: 1, cx: -0.5, cy: -0.5}
      case 'b':
        return {dx: 0, dy: 1, cx: 0.0, cy: -0.5}
      case 'bl':
        return {dx: -1, dy: 1, cx: 0.5, cy: -0.5}
      case 'l':
        return {dx: -1, dy: 0, cx: 0.5, cy: 0.0}
      default:
        throw new Error(`Unsupported resize handle: ${name}`)
    }
  })()

  if (symmetric) {
    // When resizing symmetrically, center should not move.
    return {...base, cx: 0, cy: 0}
  }

  return base
}
*/
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
export const createWith = (tagName, role, id, style) => {
    const dom = document.createElement(tagName);
    dom.setAttribute(role, '');
    dom.id = role + '-' + id;
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
export const getManipulationBox = (rect, rotation, ratio) => {
    const resizeLen = 10 / ratio;
    const resizeStrokeWidth = 1 / ratio;
    const rotateRadius = 20 / ratio;
    const { cx, cy, width, height } = rect;
    const arr = [
        { name: 'tl', dx: -0.5, dy: -0.5 },
        { name: 't', dx: 0.0, dy: 0.5 },
        { name: 'tr', dx: -0.5, dy: 0.5 },
        { name: 'r', dx: -0.5, dy: 0.0 },
        { name: 'br', dx: -0.5, dy: -0.5 },
        { name: 'b', dx: 0.0, dy: -0.5 },
        { name: 'bl', dx: 0.5, dy: -0.5 },
        { name: 'l', dx: 0.5, dy: 0.0 },
    ];
    const result = [];
    return arr.map(({ dx, dy, name }) => {
        const lx = cx + dx * width;
        const ly = cy + dy * height;
        const resizeHandleEleProp = {
            id: 'handle-resize-' + name,
            layer: 1,
            cx: lx,
            cy: ly,
            width: resizeLen,
            height: resizeLen,
            rotation,
            stroke: {
                ...DEFAULT_STROKE,
                weight: resizeStrokeWidth,
            },
        };
        const rotateHandleEleProp = {
            id: 'handle-rotate-' + name,
            layer: 0,
            cx: lx,
            cy: ly,
            r1: rotateRadius,
            r2: rotateRadius,
            rotation,
        };
        result.push(new Rectangle(resizeHandleEleProp), new Ellipse(rotateHandleEleProp));
        return;
    });
    /*
      return HANDLER_OFFSETS.map((OFFSET, index): ElementInstance => {
        console.log(OFFSET, index)
        // Calculate the handle position in local coordinates
        const currentCenterX = cx - width / 2 + OFFSET.x * width
        const currentCenterY = cy - height / 2 + OFFSET.y * height
  
        const handleElementProps: RectangleProps = {
          // id: `${id}-${OFFSET.type}-${index}`,
          layer: 0,
          rotation,
        }
  
        // let cursor: ResizeCursor = OFFSET.cursor as ResizeCursor
  
        if (OFFSET.type === 'resize') {
          const rotated = rotatePointAroundPoint(currentCenterX, currentCenterY, cx, cy, rotation)
  
          handleElementProps.cx = rotated.x
          handleElementProps.cy = rotated.y
          handleElementProps.width = resizeConfig.size
          handleElementProps.height = resizeConfig.size
          handleElementProps.stroke = {
            ...DEFAULT_STROKE,
            weight: resizeConfig.lineWidth,
          }
          // currentElementProps.stroke.weight = resizeConfig.stroke?.weight
          // currentElementProps.lineColor = resizeConfig.lineColor
          // currentElementProps.fillColor = resizeConfig.fillColor
        } else if (OFFSET.type === 'rotate') {
          const currentRotateHandlerCX = currentCenterX + OFFSET.offsetX * resizeConfig.lineWidth
          const currentRotateHandlerCY = currentCenterY + OFFSET.offsetY * resizeConfig.lineWidth
          const rotated = rotatePointAroundPoint(
            currentRotateHandlerCX,
            currentRotateHandlerCY,
            cx,
            cy,
            rotation,
          )
  
          // handleElementProps.id = index + '-rotate'
          handleElementProps.cx = rotated.x
          handleElementProps.cy = rotated.y
          handleElementProps.width = rotateConfig.size
          handleElementProps.height = rotateConfig.size
          handleElementProps.lineWidth = rotateConfig.lineWidth
          handleElementProps.lineColor = rotateConfig.lineColor
          handleElementProps.fillColor = rotateConfig.fillColor
        }*/
    /*    return {
          id: `${id}`,
          type: OFFSET.type,
          name: OFFSET.name,
          // cursor,
          elementOrigin,
          element: new ElementRectangle(handleElementProps),
        }*/
};
