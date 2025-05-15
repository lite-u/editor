// import {updateSelectionBox} from "../domManipulations.ts"
function handleKeyDown(e) {
    const { shiftKey, metaKey, ctrlKey, altKey } = e;
    // if (target !== this.editor.container) return
    const { interaction, action, toolManager } = this.editor;
    // const {state} = interaction
    if (e.code === 'Space') {
        action.dispatch('switch-tool', 'panning');
        if (!interaction._lastTool) {
            interaction._lastTool = toolManager.currentToolName;
        }
        e.preventDefault();
    }
    else {
        interaction._modifier = { ...interaction._modifier, shiftKey, metaKey, ctrlKey, altKey };
        this.tool.mouseMove.call(this);
    }
}
export default handleKeyDown;
