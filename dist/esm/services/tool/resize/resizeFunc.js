import { getAnchorsByResizeDirection, getBoundingRectFromBoundingRects } from './helper.js';
import { getSameRotationRectsBoundingRect } from '../../../core/utils.js';
import { rotatePointAroundPoint } from '../../../core/geometry.js';
function resizeFunc(elements, placement = 'br') {
    const changes = [];
    const { interaction } = this.editor;
    const { mouseWorldCurrent, _modifier } = interaction;
    const { altKey, shiftKey } = _modifier;
    const rectsWithRotation = [];
    const rectsWithoutRotation = [];
    let applyRotation = elements[0].rotation;
    let rect;
    let sameRotation = true;
    let anchorNearMouse;
    let anchorOppositeMouse;
    elements.forEach(element => {
        if (sameRotation && element.rotation !== elements[0].rotation) {
            sameRotation = false;
        }
        rectsWithRotation.push(element.getBoundingRectFromOriginal());
        rectsWithoutRotation.push(element.getBoundingRectFromOriginal(true));
    });
    applyRotation = sameRotation ? applyRotation : 0;
    if (sameRotation) {
        rect = getSameRotationRectsBoundingRect(rectsWithoutRotation, applyRotation);
    }
    else {
        rect = getBoundingRectFromBoundingRects(rectsWithRotation);
    }
    // console.log('rect', sameRotation, rect)
    const { anchor, opposite } = getAnchorsByResizeDirection(rect, placement);
    const centerX = rect.cx;
    const centerY = rect.cy;
    if (applyRotation > 0) {
        anchorNearMouse = rotatePointAroundPoint(anchor.x, anchor.y, centerX, centerY, applyRotation);
        anchorOppositeMouse = rotatePointAroundPoint(opposite.x, opposite.y, centerX, centerY, applyRotation);
    }
    else {
        anchorNearMouse = anchor;
        anchorOppositeMouse = opposite;
    }
    let startVec = {
        x: anchorNearMouse.x - anchorOppositeMouse.x,
        y: anchorNearMouse.y - anchorOppositeMouse.y,
    };
    let currentVec;
    // let _currentAnchor: Point = mouseWorldCurrent
    /*  if (applyRotation > 0) {
        _currentAnchor = rotatePointAroundPoint(mouseWorldCurrent.x, mouseWorldCurrent.y, centerX, centerY, -applyRotation)
      }*/
    currentVec = {
        x: mouseWorldCurrent.x - anchorOppositeMouse.x,
        y: mouseWorldCurrent.y - anchorOppositeMouse.y,
    };
    if (altKey) {
        startVec = {
            x: anchorNearMouse.x - centerX,
            y: anchorNearMouse.y - centerY,
        };
        currentVec = {
            x: mouseWorldCurrent.x - centerX,
            y: mouseWorldCurrent.y - centerY,
        };
    }
    // console.log('startVecs !!!',startVec.x,startVec.y)
    // let scaleX = startVec.x !== 0 ? currentVec.x / startVec.x : 1
    // let scaleY = startVec.y !== 0 ? currentVec.y / startVec.y : 1
    let scaleX = currentVec.x / startVec.x;
    let scaleY = currentVec.y / startVec.y;
    if (startVec.x === 0) {
        scaleX = 1;
        if (shiftKey) {
            scaleX = scaleY;
        }
    }
    if (startVec.y === 0) {
        scaleY = 1;
        if (shiftKey) {
            scaleY = scaleX;
        }
    }
    console.log('scalesss ', scaleY, startVec.y, currentVec.y);
    if (shiftKey) {
        // if()
        const uniformScale = Math.max(Math.abs(scaleX), Math.abs(scaleY));
        scaleX = Math.sign(scaleX) * uniformScale;
        scaleY = Math.sign(scaleY) * uniformScale;
    }
    const scalingAnchor = altKey ? { x: centerX, y: centerY } : anchorOppositeMouse;
    elements.forEach((el) => {
        const change = el.scaleFrom(scaleX, scaleY, scalingAnchor /*, {x: centerX, y: centerY}*/);
        changes.push(change);
    });
    return changes;
}
export default resizeFunc;
