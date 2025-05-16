import { isPointNear } from '../../../core/geometry.js';
export default function handlePointerMove(e) {
    const { action, rect, cursor, interaction, world, visible } = this.editor;
    const { baseCanvasContext: ctx, dpr } = world;
    const x = e.clientX - rect.x;
    const y = e.clientY - rect.y;
    const { button, shiftKey, metaKey, ctrlKey, altKey, movementX, movementY } = e;
    const viewPoint = {
        x: interaction.mouseCurrent.x * dpr,
        y: interaction.mouseCurrent.y * dpr,
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
    for (let i = arr.length - 1; i >= 0; i--) {
        const ele = arr[i];
        const path = ele.path2D;
        if (!ele.show || ele.opacity <= 0)
            continue;
        const points = ele.getPoints;
        const border = ctx.isPointInStroke(path, viewPoint.x, viewPoint.y);
        const inside = ctx.isPointInPath(path, viewPoint.x, viewPoint.y);
        const point = points.find(p => isPointNear(p, viewPoint));
        if (point) {
            interaction._hoveredElement = ele;
            interaction._pointHit = {
                type: 'anchor',
                ...point,
            };
        }
        else if (border) {
            interaction._hoveredElement = ele;
            interaction._pointHit = {
                type: 'path',
                ...viewPoint,
            };
        }
        else if (inside) {
            interaction._hoveredElement = ele;
            /* interaction._pointHit = {
               type: 'anchor',
               ...viewPoint,
             }*/
        }
        else {
            interaction._hoveredElement = null;
            interaction._pointHit = null;
        }
    }
    // snap
    if (interaction._pointDown) {
    }
    this.tool.mouseMove.call(this);
}
