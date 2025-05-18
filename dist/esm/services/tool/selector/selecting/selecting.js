import { generateBoundingRectFromTwoPoints } from '../../../../core/utils.js';
const selecting = {
    cursor: 'default',
    mouseMove() {
        const { interaction, action, selection, cursor } = this.editor;
        const { mouseStart, mouseCurrent, _pointDown, _modifier: { shiftKey, metaKey, ctrlKey } } = interaction;
        if (!_pointDown)
            return;
        const rect = generateBoundingRectFromTwoPoints(mouseStart, mouseCurrent);
        interaction.updateSelectionBox(rect);
    },
    mouseUp() {
        /*const {shiftKey, metaKey, ctrlKey} = this.editor.interaction._modifier
        const {interaction, action, selection, cursor} = this.editor
        interaction.hideSelectionBox()*/
        this.editor.interaction.hideSelectionBox();
        // this.tool = selector
    },
};
export default selecting;
