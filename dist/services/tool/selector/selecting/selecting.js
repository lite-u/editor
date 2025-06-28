"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("~/core/utils");
const lib_1 = require("~/lib/lib");
let _mouseMoved = false;
let _selecting = new Set();
let _selectedCopy = null;
const selecting = {
    cursor: 'default',
    mouseMove: function () {
        const { interaction, action, mainHost, selection } = this.editor;
        const { mouseStart, mouseCurrent, mouseWorldStart, mouseWorldCurrent, _modifier: { shiftKey, metaKey, ctrlKey }, } = interaction;
        const rect = (0, utils_1.generateBoundingRectFromTwoPoints)(mouseStart, mouseCurrent);
        const _selected = selection.values;
        if (!_selectedCopy) {
            _selectedCopy = new Set(selection.values);
        }
        interaction.updateSelectionBox(rect);
        const outer = (0, utils_1.generateBoundingRectFromTwoPoints)(mouseWorldStart, mouseWorldCurrent);
        const modifyKey = ctrlKey || metaKey || shiftKey;
        _mouseMoved = true;
        _selecting.clear();
        mainHost.visibleElements.forEach((ele) => {
            const inner = ele.boundingRect;
            if (inner.left >= outer.left &&
                inner.right <= outer.right &&
                inner.top >= outer.top &&
                inner.bottom <= outer.bottom) {
                _selecting.add(ele.id);
            }
        });
        if (modifyKey) {
            // if (_selecting.size === 0) return
            // const SD = getSymmetricDifference(_selectedCopy, _selecting)
            const merged = (0, lib_1.removeIntersectionAndMerge)(_selectedCopy, _selecting);
            if ((0, lib_1.areSetsEqual)(_selectedCopy, merged))
                return;
            console.log(merged);
            action.dispatch('selection-modify', {
                mode: 'replace',
                idSet: merged,
            });
        }
        else {
            if ((0, lib_1.areSetsEqual)(_selected, _selecting))
                return;
            if (_selecting.size === 0) {
                action.dispatch('selection-clear');
            }
            else {
                action.dispatch('selection-modify', {
                    mode: 'replace',
                    idSet: _selecting,
                });
            }
        }
        // if ((modifyKey && _selecting.size === 0) || areSetsEqual(selectedCopy, _selecting)) return
        /*
    
            const SD = getSymmetricDifference(_selectedCopy, _selecting)
            console.log(SD)
    
            if (modifyKey) {
              console.log(SD)
              action.dispatch('selection-modify', {
                mode: 'toggle',
                idSet: SD,
              })
            } else {
              action.dispatch('selection-modify', {
                mode: 'replace',
                idSet: _selecting,
              })
            }
        */
        /*
        if (_selecting.size === 0 && selectedCopy.size === 0) {
          return action.dispatch('selection-clear')
        }
        const newSet = new Set([...selectedCopy, ..._selecting])
    
        action.dispatch('selection-modify', {
          mode: 'replace',
          idSet: newSet,
        })*/
    },
    mouseUp() {
        /*const {shiftKey, metaKey, ctrlKey} = this.interaction._modifier
        const {interaction, action, selection, cursor} = this
        interaction.hideSelectionBox()*/
        this.editor.interaction.hideSelectionBox();
        // this.tool = selector
        if (!_mouseMoved) {
            this.editor.action.dispatch('selection-clear');
        }
        _mouseMoved = false;
        _selecting.clear();
        _selectedCopy === null || _selectedCopy === void 0 ? void 0 : _selectedCopy.clear();
        _selectedCopy = null;
    },
};
exports.default = selecting;
