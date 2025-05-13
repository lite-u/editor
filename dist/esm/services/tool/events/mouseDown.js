import snapTool from '../snap/snap.js';
function handleMouseDown(e) {
    const { clientY, target, button, clientX } = e;
    if (target !== this.editor.container)
        return;
    const x = clientX - this.editor.rect.x;
    const y = clientY - this.editor.rect.y;
    const { interaction, world } = this.editor;
    interaction.mouseStart = { x, y };
    interaction.mouseNow = { x, y };
    interaction.mouseWorldStart = world.getWorldPointByViewportPoint(x, y);
    interaction.mouseWorldNow = world.getWorldPointByViewportPoint(x, y);
    // console.log(operator)
    e.preventDefault();
    if (button !== 0)
        return;
    /*
  
      if (this.editor.interaction.spaceKeyDown) {
        return (this.editor.interaction.state = 'panning')
      }
    */
    snapTool.start.call(this, e);
    this.tool.start.call(this, e);
}
export default handleMouseDown;
