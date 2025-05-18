import { generateBoundingRectFromTwoPoints } from '../../../../core/utils.js';
import { areSetsEqual } from '../../../../lib/lib.js';
let _mouseMoved = false;
const selecting = {
    cursor: 'default',
    mouseMove() {
        const { interaction, action, elementManager, selection, cursor } = this.editor;
        const selectedCopy = new Set(selection.values);
        const { mouseStart, mouseCurrent, mouseWorldStart, mouseWorldCurrent, _modifier: { shiftKey, metaKey, ctrlKey }, } = interaction;
        const rect = generateBoundingRectFromTwoPoints(mouseStart, mouseCurrent);
        interaction.updateSelectionBox(rect);
        const outer = generateBoundingRectFromTwoPoints(mouseWorldStart, mouseWorldCurrent);
        const _selecting = new Set();
        const modifyKey = ctrlKey || metaKey || shiftKey;
        _mouseMoved = true;
        elementManager.all.forEach((ele) => {
            const inner = ele.getBoundingRect();
            if (inner.left >= outer.left &&
                inner.right <= outer.right &&
                inner.top >= outer.top &&
                inner.bottom <= outer.bottom) {
                _selecting.add(ele.id);
            }
        });
        const selectingChanged = !areSetsEqual(selectedCopy, _selecting);
        /**
         * Simple logic
         * If with modifyKey
         *    original-selected Symmetric Difference selecting
         * else
         *    original-selected merge selecting
         */
        if (!selectingChanged)
            return;
    },
    mouseUp() {
        /*const {shiftKey, metaKey, ctrlKey} = this.editor.interaction._modifier
        const {interaction, action, selection, cursor} = this.editor
        interaction.hideSelectionBox()*/
        this.editor.interaction.hideSelectionBox();
        // this.tool = selector
        if (!_mouseMoved) {
            this.editor.action.dispatch('selection-clear');
        }
        _mouseMoved = false;
    },
};
export default selecting;
