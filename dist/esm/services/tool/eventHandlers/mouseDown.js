function handleMouseDown(e) {
    const { clientY, target, button, clientX } = e;
    if (target !== this.editor.container)
        return;
    const x = clientX - this.editor.rect.x;
    const y = clientY - this.editor.rect.y;
    this.editor.interaction.mouseDownPoint.x = x;
    this.editor.interaction.mouseDownPoint.y = y;
    this.editor.interaction.mouseMovePoint.x = x;
    this.editor.interaction.mouseMovePoint.y = y;
    // console.log(operator)
    e.preventDefault();
    if (button !== 0)
        return;
    if (this.editor.interaction.spaceKeyDown) {
        return (this.editor.interaction.manipulationStatus = 'panning');
    }
    let tool = this.toolMap.get(this.currentToolName);
    tool.start.call(this, e);
}
export default handleMouseDown;
