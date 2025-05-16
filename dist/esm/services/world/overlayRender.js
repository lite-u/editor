import ElementRectangle from '../../elements/rectangle/rectangle.js';
import { DEFAULT_FILL, DEFAULT_STROKE } from '../../elements/defaultProps.js';
function overlayRender() {
    if (this.editor.elementManager.size === 0)
        return;
    const { overlayCanvasContext: ctx } = this;
    const { _snappedPoint, _hoveredElement } = this.editor.interaction;
    const { scale, dpr } = this.editor.world;
    const ratio = scale * dpr;
    const size = 80 / ratio;
    const lineWidth = 1 / ratio;
    const fontSize = 40 / ratio;
    // const lineColor = '#5491f8'
    const lineColor = '#ff0000';
    if (_snappedPoint) {
        drawCrossWithLabel(ctx, _snappedPoint, size, '#ff0000', lineWidth, fontSize);
    }
    if (_hoveredElement) {
        const pointProps = _hoveredElement.center;
        const eleStroke = this.editor.elementManager.create({
            ..._hoveredElement.toJSON(),
            stroke: {
                ...DEFAULT_STROKE,
                color: lineColor,
                weight: 1 / ratio,
            },
            fill: {
                enabled: false,
            },
        });
        const point = this.editor.elementManager.create({
            type: 'ellipse',
            r1: 2 / ratio,
            r2: 2 / ratio,
            cx: pointProps.x,
            cy: pointProps.y,
        });
        // console.log(lineWidth)
        console.log(eleStroke);
        // ele.stroke.weight = 3 / ratio
        // ele.stroke.color = lineColor
        point.stroke.color = lineColor;
        point.render(ctx);
        eleStroke.render(ctx);
    }
    return;
    const fillColor = '#5491f8';
    const selected = this.editor.visible.getVisibleSelected;
    const centerPointWidth = 2 / this.scale * this.dpr;
    // const lineWidth = 1 / this.scale * this.dpr
    const centerPoints = new Set(selected);
    if (this.editor.interaction._hoveredElement) {
        centerPoints.add(this.editor.interaction._hoveredElement);
    }
    // render selection box for elements
    selected.forEach((id) => {
        const ele = this.editor.elementManager.all.get(id);
        if (ele) {
            const elementSelectionBoundary = ele.getSelectedBoxElement(lineWidth, lineColor);
            elementSelectionBoundary.render(ctx);
        }
    });
    // render center points
    centerPoints.forEach((id) => {
        const element = this.editor.elementManager.all.get(id);
        const { cx, cy, rotation, layer } = element.toMinimalJSON();
        const lineWidth = 1 / this.scale * this.dpr;
        const highlightElement = element.getHighlightElement(lineWidth, fillColor);
        const BRN = id === this.editor.interaction._hoveredElement ? centerPointWidth : 0;
        const borderRadius = [BRN, BRN, BRN, BRN];
        const centerDotRect = new ElementRectangle({
            cx: cx,
            cy: cy,
            layer,
            id: id + 'hover-center',
            width: centerPointWidth * 2,
            height: centerPointWidth * 2,
            fill: {
                ...DEFAULT_FILL,
                color: fillColor,
            },
            stroke: {
                ...DEFAULT_STROKE,
                weight: lineWidth,
                color: 'transparent',
            },
            rotation,
            borderRadius,
        });
        highlightElement.render(ctx);
        centerDotRect.render(ctx);
    });
    this.editor.interaction.operationHandlers.forEach(operation => {
        operation.element.render(ctx);
    });
    /*if (this.viewport.enableCrossLine && this.viewport.drawCrossLine) {
      drawCrossLine({
        ctx,
        mousePoint: mouseMovePoint,
        scale,
        dpr,
        offset,
        worldRect: worldRect,
      })
    }*/
}
function drawCrossWithLabel(ctx, { x, y, type }, size = 6, color = 'red', lineWidth = 1, fontSize) {
    // const {x, y} = point
    const half = size / 2;
    ctx.save();
    // Draw the cross
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x - half, y - half);
    ctx.lineTo(x + half, y + half);
    ctx.moveTo(x + half, y - half);
    ctx.lineTo(x - half, y + half);
    ctx.stroke();
    // Draw the label
    ctx.fillStyle = color;
    ctx.font = fontSize + 'px sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(type, x + 5, y - 5);
    ctx.restore();
}
export default overlayRender;
