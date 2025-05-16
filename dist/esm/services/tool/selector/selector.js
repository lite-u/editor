const selector = {
    cursor: 'default',
    mouseDown() {
        const { shiftKey, metaKey, ctrlKey } = this.editor.interaction._modifier;
        const { interaction, action, selection, cursor } = this.editor;
    },
    mouseMove() {
        const { shiftKey, metaKey, ctrlKey } = this.editor.interaction._modifier;
        const { interaction, action, selection, cursor } = this.editor;
        action.dispatch('render-selection');
    },
    mouseUp() {
        const { shiftKey, metaKey, ctrlKey } = this.editor.interaction._modifier;
        const { interaction, action, selection, cursor } = this.editor;
    },
};
export default selector;
