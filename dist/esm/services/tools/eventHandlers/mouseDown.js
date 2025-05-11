function handleMouseDown(e) {
    const { clientY, target, button, clientX } = e;
    if (!(target === this.editor.container))
        return;
    const x = clientX - this.editor.viewport.rect.x;
    const y = clientY - this.editor.viewport.rect.y;
    this.mouseDownPoint.x = x;
    this.mouseDownPoint.y = y;
    this.mouseMovePoint.x = x;
    this.mouseMovePoint.y = y;
    // console.log(operator)
    e.preventDefault();
    if (button !== 0)
        return;
    if (this.spaceKeyDown) {
        return (this.manipulationStatus = 'panning');
    }
    let tool = this.toolMap.get(this.currentToolName);
    tool.start.call(this, e);
}
export default handleMouseDown;
