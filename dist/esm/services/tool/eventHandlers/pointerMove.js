export default function handlePointerMove(e) {
    const { action, rect, interaction, cursor, } = this.editor;
    const x = e.clientX - rect.x;
    const y = e.clientY - rect.y;
    interaction.mouseMovePoint.x = x;
    interaction.mouseMovePoint.y = y;
    // interaction.drawCrossLine = false
    // cursor.move({x, y})
    action.dispatch('world-mouse-move');
    let tool = this.toolMap.get(this.currentToolName);
    tool.move.call(this, e);
}
