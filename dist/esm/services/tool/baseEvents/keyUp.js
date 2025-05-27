// import {updateSelectionBox} from "../domManipulations.ts"
function handleKeyUp(e) {
    const { interaction } = this;
    const { shiftKey, metaKey, ctrlKey, altKey } = e;
    if (e.code !== 'Space') {
        interaction._modifier = { ...interaction._modifier, shiftKey, metaKey, ctrlKey, altKey };
        this.tool.mouseMove.call(this);
    }
    interaction._lastTool = null;
}
export default handleKeyUp;
