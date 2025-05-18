import { generateBoundingRectFromTwoPoints } from '../../../core/utils.js';
const selection = {
    cursor: 'default',
    mouseDown: function () {
        const { interaction, action, selection, cursor } = this.editor;
        const { mouseStart, mouseCurrent, _modifier: { shiftKey, metaKey, ctrlKey } } = interaction;
        const rect = generateBoundingRectFromTwoPoints(mouseStart, mouseCurrent);
        interaction.updateSelectionBox(rect);
        if (interaction._hoveredElement) {
            action.dispatch('selection-modify', { mode: 'replace', idSet: new Set([interaction._hoveredElement.id]) });
        }
    },
    mouseMove() {
        const { interaction, action, selection, cursor } = this.editor;
        const { mouseStart, mouseCurrent, _pointDown, _modifier: { shiftKey, metaKey, ctrlKey } } = interaction;
        if (!_pointDown)
            return;
        const rect = generateBoundingRectFromTwoPoints(mouseStart, mouseCurrent);
        interaction.updateSelectionBox(rect);
    },
    mouseUp() {
        const { shiftKey, metaKey, ctrlKey } = this.editor.interaction._modifier;
        const { interaction, action, selection, cursor } = this.editor;
        interaction.hideSelectionBox();
    },
};
export default selection;
