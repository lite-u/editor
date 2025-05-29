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
    let sameRotation = true;
    const rectsWithRotation = [];
    const rectsWithoutRotation = [];
    let rect;
    let applyRotation = elements[0].rotation;
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
        console.log({ ...rect });
    }
    else {
        rect = getBoundingRectFromBoundingRects(rectsWithRotation);
    }
    const { anchor, opposite } = getAnchorsByResizeDirection(rect, placement);
    const centerX = rect.cx;
    const centerY = rect.cy;
    let startVec = {
        x: anchor.x - opposite.x,
        y: anchor.y - opposite.y,
    };
    let currentVec;
    // console.log('anchor op', rect, sameRotation, anchor, opposite)
    if (applyRotation > 0) {
        const unRotatedMouseCurrent = rotatePointAroundPoint(mouseWorldCurrent.x, mouseWorldCurrent.y, centerX, centerY, -applyRotation);
        currentVec = {
            x: unRotatedMouseCurrent.x - opposite.x,
            y: unRotatedMouseCurrent.y - opposite.y,
        };
    }
    else {
        currentVec = {
            x: mouseWorldCurrent.x - opposite.x,
            y: mouseWorldCurrent.y - opposite.y,
        };
    }
    if (altKey) {
        /* startVec = {
           x: mouseWorldStart.x - centerX,
           y: mouseWorldStart.y - centerY,
         }*/
        currentVec = {
            x: mouseWorldCurrent.x - centerX,
            y: mouseWorldCurrent.y - centerY,
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
        const change = el.scaleFrom(scaleX, scaleY, scalingAnchor, { x: rect.cx, y: rect.cy });
        changes.push(change);
    });
    return changes;
}
export default resizeFunc;
