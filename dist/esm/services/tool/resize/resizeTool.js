function resizeTool() {
    const { interaction, action } = this.editor;
    const { mouseWorldCurrent, _modifier, mouseWorldStart, _ele } = interaction;
    const { altKey, shiftKey } = _modifier;
    const { cx, cy, width, height } = _ele.original;
    const anchor = {
        x: cx - width / 2,
        y: cy - height / 2,
    };
    const startVec = {
        x: mouseWorldStart.x - anchor.x,
        y: mouseWorldStart.y - anchor.y,
    };
    const currentVec = {
        x: mouseWorldCurrent.x - anchor.x,
        y: mouseWorldCurrent.y - anchor.y,
    };
    // Prevent division by 0
    let scaleX = startVec.x !== 0 ? currentVec.x / startVec.x : 1;
    let scaleY = startVec.y !== 0 ? currentVec.y / startVec.y : 1;
    if (shiftKey) {
        const uniformScale = Math.max(Math.abs(scaleX), Math.abs(scaleY));
        scaleX = Math.sign(scaleX) * uniformScale;
        scaleY = Math.sign(scaleY) * uniformScale;
    }
    const scalingAnchor = altKey
        ? { x: cx, y: cy }
        : anchor;
    interaction._ele.scaleFrom(scaleX, scaleY, scalingAnchor);
    action.dispatch('visible-element-updated');
}
export default resizeTool;
