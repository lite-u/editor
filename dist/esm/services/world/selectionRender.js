import ElementRectangle from '../../elements/rectangle/rectangle.js';
function selectionRender() {
    if (this.editor.elementManager.size === 0)
        return;
    const { selectionCanvasContext: ctx } = this;
    const fillColor = '#5491f8';
    const lineColor = '#5491f8';
    const selected = this.editor.visible.getVisibleSelected;
    const centerPointWidth = 2 / this.scale * this.dpr;
    const lineWidth = 1 / this.scale * this.dpr;
    const centerPoints = new Set(selected);
    if (this.editor.interaction.hoveredElement) {
        centerPoints.add(this.editor.interaction.hoveredElement);
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
        const centerDotRect = new ElementRectangle({
            cx: cx,
            cy: cy,
            layer,
            id: id + 'hover-center',
            width: centerPointWidth * 2,
            height: centerPointWidth * 2,
            fillColor: fillColor,
            lineColor: 'transparent',
            lineWidth,
            rotation,
            opacity: 100,
            borderRadius: id === this.editor.interaction.hoveredElement ? centerPointWidth : 0,
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
export default selectionRender;
