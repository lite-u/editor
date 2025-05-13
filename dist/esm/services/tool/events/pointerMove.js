export default function handlePointerMove(e) {
    const { action, rect, interaction, } = this.editor;
    const x = e.clientX - rect.x;
    const y = e.clientY - rect.y;
    interaction.mouseMove.x = x;
    interaction.mouseMove.y = y;
    // interaction.drawCrossLine = false
    // cursor.move({x, y})
    action.dispatch('world-mouse-move');
    // let tool = this.tool
    // console.log(tool)
    this.tool.move.call(this, e);
}
