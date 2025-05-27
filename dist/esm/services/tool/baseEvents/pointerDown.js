import snapTool from '../snap/snap.js';
function handleMouseDown(e) {
    console.log(this);
    const { element, originalEvent } = e;
    const { button, shiftKey, metaKey, ctrlKey, altKey, clientX, clientY, movementX, movementY } = originalEvent;
    const modifiers = { shiftKey, metaKey, ctrlKey, altKey, button, movementX, movementY };
    const x = clientX - this.editor.rect.x;
    const y = clientY - this.editor.rect.y;
    const { interaction, world } = this.editor;
    interaction.mouseStart = { x, y };
    interaction.mouseCurrent = { x, y };
    interaction.mouseWorldStart = world.getWorldPointByViewportPoint(x, y);
    interaction.mouseWorldCurrent = world.getWorldPointByViewportPoint(x, y);
    this.editor.interaction._modifier = modifiers;
    this.editor.interaction._pointDown = true;
    this.tool?.mouseDown?.call(this, e);
    // this.action.dispatch('clear-creation')
    snapTool.call(this);
}
export default handleMouseDown;
