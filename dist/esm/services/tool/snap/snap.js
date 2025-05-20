import { isPointNearStroke2 } from '../helper.js';
import { isPointNear } from '../../../core/geometry.js';
function snapTool() {
    const { interaction, world, visible } = this.editor;
    const { baseCanvasContext: ctx, scale, dpr } = world;
    const { x, y } = interaction.mouseCurrent;
    const viewPoint = {
        x: x * dpr,
        y: y * dpr,
    };
    const arr = visible.values;
    let _ele = null;
    let _snappedPoint = null;
    for (let i = arr.length - 1; i >= 0; i--) {
        const ele = arr[i];
        const path = ele.path2D;
        // console.log(interaction._hoveredElement)
        if (!ele.show || ele.opacity <= 0 || interaction._draggingElements.includes(ele))
            continue;
        const points = ele.getPoints;
        // const border = ctx.isPointInStroke(path, viewPoint.x, viewPoint.y)
        // const onBorder = isPointNearStroke(ctx, path, viewPoint, 2, .1)
        const lineWidth = 1 * dpr / scale;
        const isNearStroke = isPointNearStroke2(ctx, path, viewPoint, 0, lineWidth);
        // const isOn = isPointNearStroke(ctx, path, viewPoint, 2, 1)
        const inside = ctx.isPointInPath(path, viewPoint.x, viewPoint.y);
        const point = points.find(p => isPointNear(p, viewPoint));
        if (point) {
            // _snapped = true
            _ele = ele;
            _snappedPoint = { type: 'anchor', ...point };
            break;
        }
        else if (isNearStroke) {
            // console.log(isNearStroke)
            // const {dpr} = world
            /*      const p = {
                    x:Math.round(interaction.mouseWorldCurrent.x),
                    y:Math.round(interaction.mouseWorldCurrent.y),
                  }*/
            _ele = ele;
            /* _snappedPoint = {
               type: 'path',
               ...world.getWorldPointByViewportPoint(
                 onBorder.x / dpr,
                 onBorder.y / dpr,
               ),
             }*/
            _snappedPoint = {
                type: 'path',
                ...world.getWorldPointByViewportPoint(viewPoint.x / dpr, viewPoint.y / dpr),
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
        interaction._snappedPoint = null;
    }
    interaction._hoveredElement = _ele;
}
export default snapTool;
