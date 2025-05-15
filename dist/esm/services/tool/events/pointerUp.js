function handleMouseUp(e) {
    this.tool.mouseUp.call(this);
    this.editor.container.releasePointerCapture(e.pointerId);
}
export default handleMouseUp;
