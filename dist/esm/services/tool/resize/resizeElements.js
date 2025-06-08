import { getAnchorsByResizeDirection, getBoundingRectFromBoundingRects } from './helper.js';
import { getSameRotationRectsBoundingRect } from '../../../core/utils.js';
import { rotatePointAroundPoint } from '../../../core/geometry.js';
function resizeElements(elements, placement = 'br') {
    const changes = [];
    const { interaction } = this.editor;
    const { mouseWorldCurrent, _modifier } = interaction;
    const { altKey, shiftKey } = _modifier;
    const rectsWithRotation = [];
    const rectsWithoutRotation = [];
    let applyRotation = elements[0].rotation;
    let rect;
    let sameRotation = true;
    let anchorOppositeMouse;
    elements.forEach(element => {
        if (sameRotation && element.rotation !== elements[0].rotation) {
            sameRotation = false;
        }
        rectsWithRotation.push(element.originalBoundingRect);
        rectsWithoutRotation.push(element.originalBoundingRectWithRotation);
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
        anchorOppositeMouse = rotatePointAroundPoint(opposite.x, opposite.y, centerX, centerY, applyRotation);
    }
    else {
        anchorOppositeMouse = opposite;
    }
    let startVec = {
        x: anchor.x - opposite.x,
        y: anchor.y - opposite.y,
    };
    let currentVec;
    let unRotatedMouse = mouseWorldCurrent;
    if (applyRotation > 0) {
        unRotatedMouse = rotatePointAroundPoint(mouseWorldCurrent.x, mouseWorldCurrent.y, centerX, centerY, -applyRotation);
    }
    currentVec = {
        x: unRotatedMouse.x - opposite.x,
        y: unRotatedMouse.y - opposite.y,
    };
    if (altKey) {
        startVec = {
            x: anchor.x - centerX,
            y: anchor.y - centerY,
        };
        currentVec = {
            x: unRotatedMouse.x - centerX,
            y: unRotatedMouse.y - centerY,
        };
    }
    // console.log('startVecs !!!',startVec.x, startVec.y)
    let scaleX = startVec.x !== 0 ? currentVec.x / startVec.x : 1;
    let scaleY = startVec.y !== 0 ? currentVec.y / startVec.y : 1;
    if (shiftKey) {
        // console.log(scaleX,scaleY)
        if (scaleX === 1) {
            scaleX = scaleY;
        }
        else if (scaleY === 1) {
            scaleY = scaleX;
        }
        else {
            const uniformScale = Math.max(Math.abs(scaleX), Math.abs(scaleY));
            // scaleX = uniformScale
            // scaleY = uniformScale
            scaleX = Math.sign(scaleX) * uniformScale;
            scaleY = Math.sign(scaleY) * uniformScale;
        }
    }
    const scalingAnchor = altKey ? { x: centerX, y: centerY } : anchorOppositeMouse;
    const transformFlag = !sameRotation && !shiftKey && elements.length > 1;
    elements.forEach((el) => {
        el.transforming = transformFlag && el.rotation > 0 && (el.type === 'rectangle' || el.type === 'ellipse' || el.type === 'text');
        const change = el.scaleFrom(scaleX, scaleY, scalingAnchor, applyRotation);
        // el.updateBoundingRect()
        // el.updateOriginalBoundingRect()
        changes.push(change);
    });
    return changes;
}
export default resizeElements;
