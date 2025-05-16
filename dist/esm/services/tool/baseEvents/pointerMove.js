import { isPointNear } from '../../../core/geometry.js';
import { isPointNearStroke } from '../helper.js';
export default function handlePointerMove(e) {
    const { action, rect, cursor, interaction, world, visible } = this.editor;
    const { baseCanvasContext: ctx, dpr } = world;
    const x = e.clientX - rect.x;
    const y = e.clientY - rect.y;
    const { button, shiftKey, metaKey, ctrlKey, altKey, movementX, movementY } = e;
    const viewPoint = {
        x: x * dpr,
        y: y * dpr,
    };
    interaction.mouseCurrent = { x, y };
    interaction.mouseDelta.x = x - interaction.mouseStart.x;
    interaction.mouseDelta.y = y - interaction.mouseStart.y;
    interaction.mouseWorldCurrent = world.getWorldPointByViewportPoint(x, y);
    interaction.mouseWorldDelta = world.getWorldPointByViewportPoint(x, y);
    cursor.move({ x: e.clientX, y: e.clientY });
    action.dispatch('world-mouse-move');
    this.editor.interaction._modifier = { button, shiftKey, metaKey, ctrlKey, altKey, movementX, movementY };
    const arr = visible.values;
    let _ele = null;
    let _snappedPoint = null;
    // interaction._hoveredElement = null
    // interaction._pointHit = null
    for (let i = arr.length - 1; i >= 0; i--) {
        const ele = arr[i];
        const path = ele.path2D;
        if (!ele.show || ele.opacity <= 0)
            continue;
        const points = ele.getPoints;
        // const border = ctx.isPointInStroke(path, viewPoint.x, viewPoint.y)
        const onBorder = isPointNearStroke(ctx, path, viewPoint, .1);
        const inside = ctx.isPointInPath(path, viewPoint.x, viewPoint.y);
        const point = points.find(p => isPointNear(p, viewPoint));
        if (point) {
            // _snapped = true
            _ele = ele;
            _snappedPoint = { type: 'anchor', ...point };
            break;
        }
        else if (onBorder) {
            console.log(onBorder);
            // const {dpr} = world
            /*      const p = {
                    x:Math.round(interaction.mouseWorldCurrent.x),
                    y:Math.round(interaction.mouseWorldCurrent.y),
                  }*/
            _ele = ele;
            _snappedPoint = {
                type: 'path',
                ...world.getWorldPointByViewportPoint(onBorder.x / dpr, onBorder.y / dpr),
            };
            break;
        }
        else if (inside) {
            if (ele.fill.enabled) {
                _ele = ele;
            }
        }
    }
    // update
    if (_snappedPoint) {
        interaction._snappedPoint = _snappedPoint;
    }
    else if (interaction._snappedPoint) {
        // try to detach from snap point
        const dx = Math.abs(interaction.mouseWorldCurrent.x - interaction._snappedPoint.x);
        const dy = Math.abs(interaction.mouseWorldCurrent.y - interaction._snappedPoint.y);
        if (dx > .5 || dy > .5) {
            interaction._snappedPoint = null;
        }
    }
    interaction._hoveredElement = _ele;
    action.dispatch('render-overlay');
    this.tool.mouseMove.call(this);
}
