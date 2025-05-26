import snapTool from '../snap/snap.js';
function handleMouseDown(e) {
    const { element, originalEvent } = e;
    const { button, target, shiftKey, metaKey, ctrlKey, altKey, clientX, clientY, movementX, movementY } = originalEvent;
    console.log(e);
    if (button !== 0 || target !== this.editor.container)
        return;
    const modifiers = { shiftKey, metaKey, ctrlKey, altKey, button, movementX, movementY };
    const x = clientX - this.editor.rect.x;
    const y = clientY - this.editor.rect.y;
    const { interaction, world } = this.editor;
    interaction.mouseStart = { x, y };
    interaction.mouseCurrent = { x, y };
    interaction.mouseWorldStart = world.getWorldPointByViewportPoint(x, y);
    interaction.mouseWorldCurrent = world.getWorldPointByViewportPoint(x, y);
    // console.log(operator)
    // this.editor.container.setPointerCapture(e.pointerId)
    this.editor.interaction._modifier = modifiers;
    this.editor.interaction._pointDown = true;
    // e.preventDefault()
    if (button !== 0)
        return;
    if (!element) {
        this.tool?.mouseDown?.call(this.editor);
    }
    // this.editor.action.dispatch('clear-creation')
    snapTool.call(this);
}
export default handleMouseDown;
