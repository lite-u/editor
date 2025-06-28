"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function snapTool() {
    const { interaction } = this.editor;
    // update
    if (interaction._snappedPoint) {
        // try to detach from snap point
        const dx = Math.abs(interaction.mouseWorldCurrent.x - interaction._snappedPoint.x);
        const dy = Math.abs(interaction.mouseWorldCurrent.y - interaction._snappedPoint.y);
        if (dx > .5 || dy > .5) {
            interaction._snappedPoint = null;
        }
        interaction._snappedPoint = null;
    }
}
exports.default = snapTool;
