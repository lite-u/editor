function handleMouseUp(e) {
    // const {button, target} = e.originalEvent
    this.tool.mouseUp.call(this.editor);
    this.editor.interaction._pointDown = false;
    // this.editor.action.dispatch('clear-creation')
    this.editor.action.dispatch('world-mouse-up');
}
export default handleMouseUp;
