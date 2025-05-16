const selector = {
    cursor: 'default',
    mouseDown() {
        const { shiftKey, metaKey, ctrlKey } = this.editor.interaction._modifier;
        const { interaction, action, selection, cursor } = this.editor;
        if (interaction._hoveredElement) {
            action.dispatch('selection-modify', { mode: 'replace', idSet: new Set([interaction._hoveredElement.id]) });
        }
    },
    mouseMove() {
        const { shiftKey, metaKey, ctrlKey } = this.editor.interaction._modifier;
        const { interaction, action, selection, cursor } = this.editor;
    },
    mouseUp() {
        const { shiftKey, metaKey, ctrlKey } = this.editor.interaction._modifier;
        const { interaction, action, selection, cursor } = this.editor;
    },
};
export default selector;
