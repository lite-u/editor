import { generateBoundingRectFromTwoPoints } from '../../../core/utils.js';
import { areSetsEqual, getSymmetricDifference } from '../../../lib/lib.js';
import { getResizeCursor, getRotateAngle } from './helper.js';
import { applyRotating, detectHoveredElement } from '../helper.js';
const selector = {
    cursor: 'default',
    mouseDown(e) {
        const { interaction, action, selection, cursor } = this.editor;
        const { shiftKey, metaKey, ctrlKey } = e;
        const modifyKey = ctrlKey || metaKey || shiftKey;
        const operator = detectHoveredElement.call(this);
        if (operator) {
            if (operator.type === 'resize') {
                interaction._resizingOperator = operator;
                return (interaction.state = 'resizing');
            }
            else if (operator.type === 'rotate') {
                interaction._rotatingOperator = operator;
                return (interaction.state = 'rotating');
            }
        }
        const hoveredElement = interaction.hoveredElement;
        // console.log(hoveredElement)
        // Click on blank area and not doing multi-selection
        if (!hoveredElement) {
            // Determine clear selected elements
            if (!modifyKey) {
                action.dispatch('selection-clear');
            }
            interaction.selectedShadow = selection.values;
            // console.warn(this.selectedShadow)
            return (interaction.state = 'selecting');
        }
        interaction.state = 'dragging';
        const realSelected = selection.values;
        // this._ele = new Set(this.selectedElements)
        const isSelected = realSelected.has(hoveredElement);
        // console.log(isSelected)
        if (realSelected.size === 0 || (!isSelected && !modifyKey)) {
            // Initial selection or replace selection without modifier key
            action.dispatch('selection-modify', {
                mode: 'replace',
                idSet: new Set([hoveredElement]),
            });
            interaction._ele = new Set([hoveredElement]);
        }
        else if (modifyKey) {
            interaction._ele = new Set(realSelected);
            if (isSelected) {
                console.log('isSelected', isSelected);
                interaction._deselection = hoveredElement;
                interaction._ele.add(hoveredElement);
            }
            else {
                // Add to existing selection
                action.dispatch('selection-modify', {
                    mode: 'add',
                    idSet: new Set([hoveredElement]),
                });
            }
            interaction._ele.add(hoveredElement);
        }
        else {
            // Dragging already selected element(s)
            interaction._ele = new Set(realSelected);
        }
    },
    mouseMove(e) {
        const { action, container, world, interaction, elementManager, cursor, } = this.editor;
        const { _ele, selectedShadow, _selectingElements, mouseStart, mouseCurrent, } = interaction;
        switch (interaction.state) {
            case 'selecting':
                {
                    // container.setPointerCapture(e.pointerId)
                    const rect = generateBoundingRectFromTwoPoints(mouseStart, mouseCurrent);
                    const pointA = world.getWorldPointByViewportPoint(rect.x, rect.y);
                    const pointB = world.getWorldPointByViewportPoint(rect.right, rect.bottom);
                    const virtualSelectionRect = generateBoundingRectFromTwoPoints(pointA, pointB);
                    const _selecting = new Set();
                    const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey;
                    elementManager.all.forEach((ele) => {
                        if (ele.isInsideRect(virtualSelectionRect)) {
                            _selecting.add(ele.id);
                        }
                    });
                    const selectingChanged = !areSetsEqual(_selectingElements, _selecting);
                    interaction.updateSelectionBox(rect);
                    /**
                     * Simple logic
                     * If with modifyKey
                     *    original-selected Symmetric Difference selecting
                     * else
                     *    original-selected merge selecting
                     */
                    if (!selectingChanged)
                        return;
                    interaction._selectingElements = _selecting;
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
                    // container.setPointerCapture(e.pointerId)
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
                    // container.setPointerCapture(e.pointerId)
                    console.log(this.editor.interaction._ele);
                    // const {altKey, shiftKey} = e
                    // const {x, y} = interaction._rotatingOperator!.elementOrigin
                    // const centerPoint = world.getViewPointByWorldPoint(x, y)
                    // const cursorDirection = getResizeDirection(centerPoint, interaction.mouseMovePoint)
                    /*const r = applyResize.call(this, altKey, shiftKey)
                    // console.log(r)
                    action.dispatch('element-modifying', {
                      type: 'resize',
                      data: r,
                    })*/
                }
                break;
            case 'rotating':
                {
                    // container.setPointerCapture(e.pointerId)
                    const { shiftKey } = e;
                    const { x, y } = interaction._rotatingOperator.elementOrigin;
                    const centerPoint = world.getViewPointByWorldPoint(x, y);
                    const rotation = applyRotating.call(this, shiftKey);
                    const cursorAngle = getRotateAngle(centerPoint, mouseCurrent);
                    cursor.move(mouseCurrent, cursorAngle);
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
                    const moved = Math.abs(interaction.mouseCurrent.x - mouseStart.x) >
                        MOVE_THROTTLE ||
                        Math.abs(interaction.mouseCurrent.y - mouseStart.y) >
                            MOVE_THROTTLE;
                    if (moved) {
                        if (_ele.size > 0) {
                            interaction.state = 'dragging';
                        }
                        else {
                            interaction.state = 'selecting';
                        }
                    }
                }
                break;
            case 'static':
                {
                    const r = detectHoveredElement.call(this);
                    const { interaction } = this.editor;
                    if (r) {
                        if (r.type === 'rotate') {
                            const centerPoint = world.getViewPointByWorldPoint(r.elementOrigin.x, r.elementOrigin.y);
                            const angle = getRotateAngle(centerPoint, mouseCurrent);
                            cursor.set('rotate');
                            cursor.move(mouseCurrent, angle);
                            // updateCursor.call(this, 'rotate', mouseMovePoint, angle)
                        }
                        else if (r.type === 'resize') {
                            const { x, y } = r.elementOrigin;
                            const centerPoint = world.getViewPointByWorldPoint(x, y);
                            const cursorDirection = getResizeCursor(interaction.mouseCurrent, centerPoint);
                            cursor.set('resize', cursorDirection);
                            // updateCursor.call(this, 'resize', cursorDirection)
                        }
                    }
                    else {
                        // updateCursor.call(this, 'default')
                        cursor.set('selector');
                    }
                    // container.releasePointerCapture(e.pointerId)
                    // viewport.drawCrossLine = viewport.drawCrossLineDefault
                }
                break;
        }
    },
    mouseUp(e) {
        const leftMouseClick = e.button === 0;
        if (leftMouseClick) {
            const { interaction, 
            // _ele,
            // state,
            elementManager, 
            // container,
            action, selection, rect, world, } = this.editor;
            const { _ele, state, mouseStart, mouseCurrent, 
            // elementManager,
            _selectingElements, selectedShadow,
            // viewport,
             } = interaction;
            const { dpr, scale } = world;
            const elementMap = elementManager.all;
            const x = e.clientX - rect.x;
            const y = e.clientY - rect.y;
            const modifyKey = e.ctrlKey || e.metaKey || e.shiftKey;
            mouseCurrent.x = x;
            mouseCurrent.y = y;
            switch (state) {
                case 'selecting':
                    break;
                /*
                        case 'panning':
                          updateCursor.call(this, 'grabbing')
                          // this.viewport.translateViewport(e.movementX, e.movementY)
        
                          break*/
                case 'dragging':
                    {
                        const x = ((mouseCurrent.x - mouseStart.x) * dpr) / scale;
                        const y = ((mouseCurrent.y - mouseStart.y) * dpr) / scale;
                        const moved = !(x === 0 && y === 0);
                        // mouse stay static
                        if (moved) {
                            const changes = [];
                            action.dispatch('element-modifying', {
                                type: 'move',
                                data: { x: -x, y: -y },
                            });
                            // Move back to origin position and do the move again
                            _ele.forEach((id) => {
                                const ele = elementMap.get(id);
                                if (ele) {
                                    const change = {
                                        id,
                                        props: {
                                            x: ele.cx + x,
                                            y: ele.cy + y,
                                        },
                                    };
                                    changes.push(change);
                                }
                            });
                            action.dispatch('element-modify', changes);
                        }
                        else {
                            const closestId = interaction.hoveredElement;
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
                        const elementOrigin = interaction._resizingOperator?.elementOrigin;
                        const rollbackProps = {};
                        Object.keys(props).forEach((key) => {
                            rollbackProps[key] = elementOrigin[key];
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
                        const { rotation } = interaction._rotatingOperator?.elementOrigin;
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
                        selection.toggle(_ele);
                    }
                    else {
                        selection.replace(_ele);
                    }
                    break;
            }
            _ele.clear();
            selectedShadow.clear();
            _selectingElements.clear();
            _selectingElements.clear();
            interaction.state = 'static';
            interaction._deselection = null;
            interaction._resizingOperator = null;
            interaction.updateSelectionBox({ x: 0, y: 0, width: 0, height: 0 }, false);
        }
    },
};
export default selector;
