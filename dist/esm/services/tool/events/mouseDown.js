import snapTool from '../snap/snap.js';
function handleMouseDown(e) {
    const { clientY, target, button, clientX } = e;
    if (target !== this.editor.container)
        return;
    const x = clientX - this.editor.rect.x;
    const y = clientY - this.editor.rect.y;
    this.editor.interaction.mouseStart.x = x;
    this.editor.interaction.mouseStart.y = y;
    this.editor.interaction.mouseMove.x = x;
    this.editor.interaction.mouseMove.y = y;
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
