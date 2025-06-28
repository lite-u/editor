"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const domManipulations_ts_1 = require("../domManipulations.ts");
const base_ts_1 = __importDefault(require("../../../core/modules/base.ts"));
const funcs_ts_1 = require("./funcs.ts");
function handleMouseUp(e) {
    var _a, _b;
    const leftMouseClick = e.button === 0;
    if (leftMouseClick) {
        const { draggingModules, manipulationStatus, moduleMap, _selectingModules, selectedShadow, viewport, } = this;
        const x = e.clientX - viewport.rect.x;
        const y = e.clientY - viewport.rect.y;
        const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey;
        // console.log('up',manipulationStatus)
        viewport.mouseMovePoint.x = x;
        viewport.mouseMovePoint.y = y;
        switch (manipulationStatus) {
            case 'selecting':
                break;
            case 'panning':
                domManipulations_ts_1.updateCursor.call(this, 'grabbing');
                // this.viewport.translateViewport(e.movementX, e.movementY)
                break;
            case 'dragging':
                {
                    const x = ((viewport.mouseMovePoint.x - viewport.mouseDownPoint.x) *
                        viewport.dpr) /
                        viewport.scale;
                    const y = ((viewport.mouseMovePoint.y - viewport.mouseDownPoint.y) *
                        viewport.dpr) /
                        viewport.scale;
                    const moved = !(x === 0 && y === 0);
                    // mouse stay static
                    if (moved) {
                        const changes = [];
                        this.action.dispatch('module-modifying', {
                            type: 'move',
                            data: { x: -x, y: -y },
                        });
                        // Move back to origin position and do the move again
                        draggingModules.forEach((id) => {
                            const module = moduleMap.get(id);
                            if (module) {
                                const change = {
                                    id,
                                    props: {
                                        x: module.x + x,
                                        y: module.y + y,
                                    },
                                };
                                changes.push(change);
                            }
                        });
                        this.action.dispatch('module-modify', changes);
                    }
                    else {
                        const closestId = this.hoveredModule;
                        if (closestId && modifyKey && closestId === this._deselection) {
                            this.action.dispatch('selection-modify', {
                                mode: 'toggle',
                                idSet: new Set([closestId]),
                            });
                        }
                    }
                }
                break;
            case 'resizing':
                {
                    const { altKey, shiftKey } = e;
                    const props = funcs_ts_1.applyResize.call(this, altKey, shiftKey);
                    const moduleOrigin = (_a = this._resizingOperator) === null || _a === void 0 ? void 0 : _a.moduleOrigin;
                    const rollbackProps = {};
                    Object.keys(props).forEach((key) => {
                        rollbackProps[key] = moduleOrigin[key];
                    });
                    // rotate back
                    this.action.dispatch('module-modifying', {
                        type: 'resize',
                        data: rollbackProps,
                    });
                    this.action.dispatch('module-modify', [{
                            id: this._resizingOperator.id,
                            props,
                        }]);
                }
                break;
            case 'rotating':
                {
                    const { shiftKey } = e;
                    const newRotation = base_ts_1.default.applyRotating.call(this, shiftKey);
                    const { rotation } = (_b = this._rotatingOperator) === null || _b === void 0 ? void 0 : _b.moduleOrigin;
                    const rollbackProps = { rotation };
                    // rotate back
                    this.action.dispatch('module-modifying', {
                        type: 'resize',
                        data: rollbackProps,
                    });
                    this.action.dispatch('module-modify', [{
                            id: this._rotatingOperator.id,
                            props: { rotation: newRotation },
                        }]);
                }
                break;
            case 'waiting':
                this.action.dispatch('selection-clear');
                break;
            case 'static':
                if (e.ctrlKey || e.metaKey || e.shiftKey) {
                    this.toggleSelected(draggingModules);
                }
                else {
                    this.replaceSelected(draggingModules);
                }
                break;
        }
        draggingModules.clear();
        selectedShadow.clear();
        _selectingModules.clear();
        _selectingModules.clear();
        this.manipulationStatus = 'static';
        this._deselection = null;
        this._resizingOperator = null;
        (0, domManipulations_ts_1.updateSelectionBox)(viewport.selectionBox, { x: 0, y: 0, width: 0, height: 0 }, false);
    }
}
exports.default = handleMouseUp;
