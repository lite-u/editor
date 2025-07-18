"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handlePointerMove;
const domManipulations_ts_1 = require("../domManipulations.ts");
const utils_ts_1 = require("../../../core/utils.ts");
const lib_ts_1 = require("../../../lib/lib.ts");
const funcs_ts_1 = require("./funcs.ts");
const base_ts_1 = __importDefault(require("../../../core/modules/base.ts"));
function handlePointerMove(e) {
    const { action, draggingModules, viewport, selectedShadow, _selectingModules, } = this;
    viewport.mouseMovePoint.x = e.clientX - viewport.rect.x;
    viewport.mouseMovePoint.y = e.clientY - viewport.rect.y;
    viewport.drawCrossLine = false;
    // hoveredModules.clear()
    action.dispatch('world-mouse-move');
    switch (this.manipulationStatus) {
        case 'selecting':
            {
                viewport.wrapper.setPointerCapture(e.pointerId);
                const rect = (0, utils_ts_1.generateBoundingRectFromTwoPoints)(viewport.mouseDownPoint, viewport.mouseMovePoint);
                const pointA = this.getWorldPointByViewportPoint(rect.x, rect.y);
                const pointB = this.getWorldPointByViewportPoint(rect.right, rect.bottom);
                const virtualSelectionRect = (0, utils_ts_1.generateBoundingRectFromTwoPoints)(pointA, pointB);
                const _selecting = new Set();
                const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey;
                this.moduleMap.forEach((module) => {
                    if (module.isInsideRect(virtualSelectionRect)) {
                        _selecting.add(module.id);
                    }
                });
                const selectingChanged = !(0, lib_ts_1.areSetsEqual)(_selectingModules, _selecting);
                (0, domManipulations_ts_1.updateSelectionBox)(viewport.selectionBox, rect);
                /**
                 * Simple logic
                 * If with modifyKey
                 *    original-selected Symmetric Difference selecting
                 * else
                 *    original-selected merge selecting
                 */
                if (!selectingChanged)
                    return;
                this._selectingModules = _selecting;
                const SD = (0, lib_ts_1.getSymmetricDifference)(selectedShadow, _selecting);
                if (modifyKey) {
                    action.dispatch('selection-modify', {
                        mode: 'replace',
                        idSet: SD,
                    });
                }
                else {
                    if (_selecting.size === 0 && selectedShadow.size === 0) {
                        return action.dispatch('selection-clear');
                    }
                    const newSet = new Set([...selectedShadow, ..._selecting]);
                    action.dispatch('selection-modify', {
                        mode: 'replace',
                        idSet: newSet,
                    });
                }
            }
            break;
        case 'panning':
            viewport.wrapper.setPointerCapture(e.pointerId);
            domManipulations_ts_1.updateCursor.call(this, 'grabbing');
            action.dispatch('world-shift', {
                x: e.movementX,
                y: e.movementY,
            });
            break;
        case 'dragging':
            {
                viewport.wrapper.setPointerCapture(e.pointerId);
                const x = (e.movementX * viewport.dpr) / viewport.scale;
                const y = (e.movementY * viewport.dpr) / viewport.scale;
                // force update
                this.action.dispatch('module-modifying', {
                    type: 'move',
                    data: { x, y },
                });
            }
            break;
        case 'resizing':
            {
                viewport.wrapper.setPointerCapture(e.pointerId);
                const { altKey, shiftKey } = e;
                // const {x, y} = this._rotatingOperator!.moduleOrigin
                // const centerPoint = this.getViewPointByWorldPoint(x, y)
                // const cursorDirection = getResizeDirection(centerPoint, viewport.mouseMovePoint)
                const r = funcs_ts_1.applyResize.call(this, altKey, shiftKey);
                // console.log(r)
                this.action.dispatch('module-modifying', {
                    type: 'resize',
                    data: r,
                });
            }
            break;
        case 'rotating':
            {
                viewport.wrapper.setPointerCapture(e.pointerId);
                const { shiftKey } = e;
                const { x, y } = this._rotatingOperator.moduleOrigin;
                const centerPoint = this.getViewPointByWorldPoint(x, y);
                const rotation = base_ts_1.default.applyRotating.call(this, shiftKey);
                const cursorAngle = (0, funcs_ts_1.getRotateAngle)(centerPoint, viewport.mouseMovePoint);
                domManipulations_ts_1.updateCursor.call(this, 'rotate', viewport.mouseMovePoint, cursorAngle);
                this.action.dispatch('module-modifying', {
                    type: 'rotate',
                    data: { rotation },
                });
            }
            break;
        case 'waiting':
            {
                console.log('mousedown');
                const MOVE_THROTTLE = 1;
                const moved = Math.abs(viewport.mouseMovePoint.x - viewport.mouseDownPoint.x) >
                    MOVE_THROTTLE ||
                    Math.abs(viewport.mouseMovePoint.y - viewport.mouseDownPoint.y) >
                        MOVE_THROTTLE;
                if (moved) {
                    if (draggingModules.size > 0) {
                        this.manipulationStatus = 'dragging';
                    }
                    else {
                        this.manipulationStatus = 'selecting';
                    }
                }
            }
            break;
        case 'static':
            {
                const r = funcs_ts_1.detectHoveredModule.call(this);
                const { viewport } = this;
                if (r) {
                    if (r.type === 'rotate') {
                        const centerPoint = this.getViewPointByWorldPoint(r.moduleOrigin.x, r.moduleOrigin.y);
                        const angle = (0, funcs_ts_1.getRotateAngle)(centerPoint, viewport.mouseMovePoint);
                        domManipulations_ts_1.updateCursor.call(this, 'rotate', viewport.mouseMovePoint, angle);
                    }
                    else if (r.type === 'resize') {
                        const { x, y } = r.moduleOrigin;
                        const centerPoint = this.getViewPointByWorldPoint(x, y);
                        const cursorDirection = (0, funcs_ts_1.getResizeCursor)(viewport.mouseMovePoint, centerPoint);
                        domManipulations_ts_1.updateCursor.call(this, 'resize', cursorDirection);
                    }
                }
                else {
                    domManipulations_ts_1.updateCursor.call(this, 'default');
                }
                viewport.wrapper.releasePointerCapture(e.pointerId);
                viewport.drawCrossLine = viewport.drawCrossLineDefault;
            }
            break;
    }
}
