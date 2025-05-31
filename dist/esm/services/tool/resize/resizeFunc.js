import { getAnchorsByResizeDirection, getBoundingRectFromBoundingRects } from './helper.js';
import { getSameRotationRectsBoundingRect } from '../../../core/utils.js';
import { rotatePointAroundPoint } from '../../../core/geometry.js';
// import Editor from '../../../main/editor.js'
function resizeFunc(elements, placement = 'br') {
    // console.log(placement)
    const changes = [];
    const { interaction /*action*/ } = this.editor;
    const { mouseWorldCurrent, mouseWorldStart, _modifier } = interaction;
    const { altKey, shiftKey } = _modifier;
    const rectsWithRotation = [];
    const rectsWithoutRotation = [];
    let applyRotation = elements[0].rotation;
    let rect;
    let sameRotation = true;
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
    let startVec = {
        x: anchor.x - opposite.x,
        y: anchor.y - opposite.y,
    };
    let currentVec;
    let _currentAnchor = mouseWorldCurrent;
    if (applyRotation > 0) {
        _currentAnchor = rotatePointAroundPoint(mouseWorldCurrent.x, mouseWorldCurrent.y, centerX, centerY, -applyRotation);
    }
    currentVec = {
        x: _currentAnchor.x - opposite.x,
        y: _currentAnchor.y - opposite.y,
    };
    if (altKey) {
        startVec = {
            x: anchor.x - centerX,
            y: anchor.y - centerY,
        };
        currentVec = {
            x: _currentAnchor.x - centerX,
            y: _currentAnchor.y - centerY,
        };
    }
    let scaleX = startVec.x !== 0 ? currentVec.x / startVec.x : 1;
    let scaleY = startVec.y !== 0 ? currentVec.y / startVec.y : 1;
    // let scaleX = currentVec.x / startVec.x
    // let scaleY = currentVec.y / startVec.y
    if (shiftKey) {
        const uniformScale = Math.max(Math.abs(scaleX), Math.abs(scaleY));
        scaleX = Math.sign(scaleX) * uniformScale;
        scaleY = Math.sign(scaleY) * uniformScale;
    }
    const scalingAnchor = altKey ? { x: centerX, y: centerY } : opposite;
    /*  if(altKey){
        scaleX/=2
        scaleY/=2
      }*/
    console.log(scaleX, scaleY, scalingAnchor);
    elements.forEach((el) => {
        const change = el.scaleFrom(scaleX, scaleY, scalingAnchor, { x: centerX, y: centerY });
        changes.push(change);
    });
    return changes;
}
export default resizeFunc;
