export default function handlePointerMove(e) {
    const { action, rect, interaction, } = this.editor;
    interaction.mouseMovePoint.x = e.clientX - rect.x;
    interaction.mouseMovePoint.y = e.clientY - rect.y;
    // interaction.drawCrossLine = false
    action.dispatch('world-mouse-move');
    let tool = this.toolMap.get(this.currentToolName);
    tool.move.call(this, e);
}
