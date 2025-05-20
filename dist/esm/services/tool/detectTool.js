import { isPointNearStroke2 } from '~/services/tool/helper';
function detectTool() {
    const { interaction, world, visible } = this.editor;
    const { baseCanvasContext: ctx, scale, dpr } = world;
    const { x, y } = interaction.mouseCurrent;
    const viewPoint = {
        x: x * dpr,
        y: y * dpr,
    };
    const elements = visible.values;
    const mElements = interaction._manipulationElements;
    interaction._hoveredElement = null;
    interaction._resizeManipulator = null;
    interaction._rotateManipulator = null;
    for (let i = 0; i < mElements.length; i++) {
    }
    for (let i = elements.length - 1; i >= 0; i--) {
        const ele = elements[i];
        const path = ele.path2D;
        if (!ele.show || ele.opacity <= 0 || interaction._draggingElements.includes(ele))
            continue;
        const lineWidth = 1 * dpr / scale;
        const isNearStroke = isPointNearStroke2(ctx, path, viewPoint, 0, lineWidth);
        const inside = ctx.isPointInPath(path, viewPoint.x, viewPoint.y);
        if (isNearStroke) {
            interaction._hoveredElement = ele;
        }
        else if (inside && ele.fill.enabled) {
            interaction._hoveredElement = ele;
        }
    }
}
export default detectTool;
