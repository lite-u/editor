function handleMouseUp(e) {
    const { button, target } = e;
    if (button !== 0 || target !== this.editor.container)
        return;
    this.tool.mouseUp.call(this.editor);
    this.editor.container.releasePointerCapture(e.pointerId);
    this.editor.interaction._pointDown = false;
    // this.editor.action.dispatch('clear-creation')
    this.editor.action.dispatch('world-mouse-up');
}
export default handleMouseUp;
