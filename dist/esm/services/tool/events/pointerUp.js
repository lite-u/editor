function handleMouseUp(e) {
    this.tool.mouseUp.call(this, e);
    this.editor.container.releasePointerCapture(e.pointerId);
}
export default handleMouseUp;
