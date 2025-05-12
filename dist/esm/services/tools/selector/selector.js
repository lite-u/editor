import { generateBoundingRectFromTwoPoints } from '../../../core/utils.js';
import { areSetsEqual, getSymmetricDifference } from '../../../lib/lib.js';
import { updateSelectionBox } from '../../viewport/domManipulations.js';
import { applyResize, detectHoveredModule, getResizeCursor, getRotateAngle } from '../eventHandlers/helper.js';
import { applyRotating } from '../helper.js';
const selector = {
    start(e) {
        const { interaction, action, selection, cursor } = this.editor;
        const { shiftKey, metaKey, ctrlKey } = e;
        const modifyKey = ctrlKey || metaKey || shiftKey;
        const operator = detectHoveredModule.call(this);
        if (operator) {
            if (operator.type === 'resize') {
                interaction._resizingOperator = operator;
                return (interaction.manipulationStatus = 'resizing');
            }
            else if (operator.type === 'rotate') {
                interaction._rotatingOperator = operator;
                return (interaction.manipulationStatus = 'rotating');
            }
        }
        const hoveredModule = interaction.hoveredModule;
        // console.log(hoveredModule)
        // Click on blank area and not doing multi-selection
        if (!hoveredModule) {
            // Determine clear selected modules
            if (!modifyKey) {
                action.dispatch('selection-clear');
            }
            interaction.selectedShadow = selection.values;
            // console.warn(this.selectedShadow)
            return (interaction.manipulationStatus = 'selecting');
        }
        interaction.manipulationStatus = 'dragging';
        const realSelected = selection.values;
        // this.draggingModules = new Set(this.selectedModules)
        const isSelected = realSelected.has(hoveredModule);
        // console.log(isSelected)
        if (realSelected.size === 0 || (!isSelected && !modifyKey)) {
            // Initial selection or replace selection without modifier key
            action.dispatch('selection-modify', {
                mode: 'replace',
                idSet: new Set([hoveredModule]),
            });
            interaction.draggingModules = new Set([hoveredModule]);
        }
        else if (modifyKey) {
            interaction.draggingModules = new Set(realSelected);
            if (isSelected) {
                console.log('isSelected', isSelected);
                interaction._deselection = hoveredModule;
                interaction.draggingModules.add(hoveredModule);
            }
            else {
                // Add to existing selection
                action.dispatch('selection-modify', {
                    mode: 'add',
                    idSet: new Set([hoveredModule]),
                });
            }
            interaction.draggingModules.add(hoveredModule);
        }
        else {
            // Dragging already selected module(s)
            interaction.draggingModules = new Set(realSelected);
        }
    },
    move(e) {
        const { action, container, world, interaction, elementManager, cursor, } = this.editor;
        const { draggingModules, selectedShadow, _selectingModules, mouseDownPoint, mouseMovePoint, } = interaction;
        switch (interaction.manipulationStatus) {
            case 'selecting':
                {
                    container.setPointerCapture(e.pointerId);
                    const rect = generateBoundingRectFromTwoPoints(mouseDownPoint, mouseMovePoint);
                    const pointA = world.getWorldPointByViewportPoint(rect.x, rect.y);
                    const pointB = world.getWorldPointByViewportPoint(rect.right, rect.bottom);
                    const virtualSelectionRect = generateBoundingRectFromTwoPoints(pointA, pointB);
                    const _selecting = new Set();
                    const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey;
                    elementManager.all.forEach((module) => {
                        if (module.isInsideRect(virtualSelectionRect)) {
                            _selecting.add(module.id);
                        }
                    });
                    const selectingChanged = !areSetsEqual(_selectingModules, _selecting);
                    updateSelectionBox(world.selectionBox, rect);
                    /**
                     * Simple logic
                     * If with modifyKey
                     *    original-selected Symmetric Difference selecting
                     * else
                     *    original-selected merge selecting
                     */
                    if (!selectingChanged)
                        return;
                    interaction._selectingModules = _selecting;
                    const SD = getSymmetricDifference(selectedShadow, _selecting);
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
            /*
      
                  case 'panning':
                    container.setPointerCapture(e.pointerId)
                    updateCursor.call(this, 'grabbing')
                    action.dispatch('world-shift',
                      {
                        x: e.movementX,
                        y: e.movementY,
                      })
      
                    break
            */
            case 'dragging':
                {
                    container.setPointerCapture(e.pointerId);
                    const x = (e.movementX * world.dpr) / world.scale;
                    const y = (e.movementY * world.dpr) / world.scale;
                    // force update
                    action.dispatch('element-modifying', {
                        type: 'move',
                        data: { x, y },
                    });
                }
                break;
            case 'resizing':
                {
                    container.setPointerCapture(e.pointerId);
                    const { altKey, shiftKey } = e;
                    // const {x, y} = interaction._rotatingOperator!.moduleOrigin
                    // const centerPoint = world.getViewPointByWorldPoint(x, y)
                    // const cursorDirection = getResizeDirection(centerPoint, interaction.mouseMovePoint)
                    const r = applyResize.call(this, altKey, shiftKey);
                    // console.log(r)
                    action.dispatch('element-modifying', {
                        type: 'resize',
                        data: r,
                    });
                }
                break;
            case 'rotating':
                {
                    container.setPointerCapture(e.pointerId);
                    const { shiftKey } = e;
                    const { x, y } = interaction._rotatingOperator.moduleOrigin;
                    const centerPoint = world.getViewPointByWorldPoint(x, y);
                    const rotation = applyRotating.call(this, shiftKey);
                    const cursorAngle = getRotateAngle(centerPoint, mouseMovePoint);
                    cursor.move(mouseMovePoint, cursorAngle);
                    // updateCursor.call(this, 'rotate', mouseMovePoint, cursorAngle)
                    action.dispatch('element-modifying', {
                        type: 'rotate',
                        data: { rotation },
                    });
                }
                break;
            case 'waiting':
                {
                    console.log('mousedown');
                    const MOVE_THROTTLE = 1;
                    const moved = Math.abs(interaction.mouseMovePoint.x - mouseDownPoint.x) >
                        MOVE_THROTTLE ||
                        Math.abs(interaction.mouseMovePoint.y - mouseDownPoint.y) >
                            MOVE_THROTTLE;
                    if (moved) {
                        if (draggingModules.size > 0) {
                            interaction.manipulationStatus = 'dragging';
                        }
                        else {
                            interaction.manipulationStatus = 'selecting';
                        }
                    }
                }
                break;
            case 'static':
                {
                    const r = detectHoveredModule.call(this);
                    const { interaction } = this.editor;
                    if (r) {
                        if (r.type === 'rotate') {
                            const centerPoint = world.getViewPointByWorldPoint(r.moduleOrigin.x, r.moduleOrigin.y);
                            const angle = getRotateAngle(centerPoint, mouseMovePoint);
                            cursor.set('rotate');
                            cursor.move(mouseMovePoint, angle);
                            // updateCursor.call(this, 'rotate', mouseMovePoint, angle)
                        }
                        else if (r.type === 'resize') {
                            const { x, y } = r.moduleOrigin;
                            const centerPoint = world.getViewPointByWorldPoint(x, y);
                            const cursorDirection = getResizeCursor(interaction.mouseMovePoint, centerPoint);
                            cursor.set('resize', cursorDirection);
                            // updateCursor.call(this, 'resize', cursorDirection)
                        }
                    }
                    else {
                        // updateCursor.call(this, 'default')
                        cursor.set('default');
                    }
                    container.releasePointerCapture(e.pointerId);
                    // viewport.drawCrossLine = viewport.drawCrossLineDefault
                }
                break;
        }
    },
    finish(e) {
        const leftMouseClick = e.button === 0;
        if (leftMouseClick) {
            const { interaction, 
            // draggingModules,
            // manipulationStatus,
            elementManager, 
            // container,
            action, selection, rect, world, } = this.editor;
            const { draggingModules, manipulationStatus, mouseDownPoint, mouseMovePoint, 
            // elementManager,
            _selectingModules, selectedShadow,
            // viewport,
             } = interaction;
            const { dpr, scale } = world;
            const elementMap = elementManager.all;
            const x = e.clientX - rect.x;
            const y = e.clientY - rect.y;
            const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey;
            mouseMovePoint.x = x;
            mouseMovePoint.y = y;
            switch (manipulationStatus) {
                case 'selecting':
                    break;
                /*
                        case 'panning':
                          updateCursor.call(this, 'grabbing')
                          // this.viewport.translateViewport(e.movementX, e.movementY)
        
                          break*/
                case 'dragging':
                    {
                        const x = ((mouseMovePoint.x - mouseDownPoint.x) * dpr) / scale;
                        const y = ((mouseMovePoint.y - mouseDownPoint.y) * dpr) / scale;
                        const moved = !(x === 0 && y === 0);
                        // mouse stay static
                        if (moved) {
                            const changes = [];
                            action.dispatch('element-modifying', {
                                type: 'move',
                                data: { x: -x, y: -y },
                            });
                            // Move back to origin position and do the move again
                            draggingModules.forEach((id) => {
                                const module = elementMap.get(id);
                                if (module) {
                                    const change = {
                                        id,
                                        props: {
                                            x: module.cx + x,
                                            y: module.cy + y,
                                        },
                                    };
                                    changes.push(change);
                                }
                            });
                            action.dispatch('element-modify', changes);
                        }
                        else {
                            const closestId = interaction.hoveredModule;
                            if (closestId && modifyKey && closestId === interaction._deselection) {
                                action.dispatch('selection-modify', {
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
                        const props = applyResize.call(this, altKey, shiftKey);
                        const moduleOrigin = interaction._resizingOperator?.moduleOrigin;
                        const rollbackProps = {};
                        Object.keys(props).forEach((key) => {
                            rollbackProps[key] = moduleOrigin[key];
                        });
                        // rotate back
                        action.dispatch('element-modifying', {
                            type: 'resize',
                            data: rollbackProps,
                        });
                        action.dispatch('element-modify', [{
                                id: interaction._resizingOperator.id,
                                props,
                            }]);
                    }
                    break;
                case 'rotating':
                    {
                        const { shiftKey } = e;
                        const newRotation = applyRotating.call(this, shiftKey);
                        const { rotation } = interaction._rotatingOperator?.moduleOrigin;
                        const rollbackProps = { rotation };
                        // rotate back
                        action.dispatch('element-modifying', {
                            type: 'resize',
                            data: rollbackProps,
                        });
                        action.dispatch('element-modify', [{
                                id: interaction._rotatingOperator.id,
                                props: { rotation: newRotation },
                            }]);
                    }
                    break;
                case 'waiting':
                    action.dispatch('selection-clear');
                    break;
                case 'static':
                    if (e.ctrlKey || e.metaKey || e.shiftKey) {
                        selection.toggle(draggingModules);
                    }
                    else {
                        selection.replace(draggingModules);
                    }
                    break;
            }
            draggingModules.clear();
            selectedShadow.clear();
            _selectingModules.clear();
            _selectingModules.clear();
            interaction.manipulationStatus = 'static';
            interaction._deselection = null;
            interaction._resizingOperator = null;
            updateSelectionBox(world.selectionBox, { x: 0, y: 0, width: 0, height: 0 }, false);
        }
    },
};
export default selector;
