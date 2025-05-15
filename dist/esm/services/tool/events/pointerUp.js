function handleMouseUp(e) {
    this.tool.mouseUp.call(this);
    this.editor.container.releasePointerCapture(e.pointerId);
    this.editor.interaction._pointDown = false;
}
export default handleMouseUp;
