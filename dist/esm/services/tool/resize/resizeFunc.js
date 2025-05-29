import { getAnchorsByResizeDirection, getBoundingRectFromBoundingRects } from './helper.js';
import { getMinimalBoundingRect } from '../../../core/utils.js';
// import Editor from '../../../main/editor.js'
function resizeFunc(elements, placement = 'br') {
    // console.log(placement)
    const changes = [];
    const { interaction /*action*/ } = this.editor;
    const { mouseWorldCurrent, _modifier } = interaction;
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
        // debugger
    });
    applyRotation = sameRotation ? applyRotation : 0;
    if (sameRotation) {
        // debugger
        rect = getMinimalBoundingRect(rectsWithoutRotation, applyRotation);
    }
    else {
        rect = getBoundingRectFromBoundingRects(rectsWithRotation);
    }
    console.log(sameRotation, rect);
    const { anchor, opposite } = getAnchorsByResizeDirection(rect, placement);
    const centerX = rect.cx;
    const centerY = rect.cy;
    const startVec = {
        x: anchor.x - opposite.x,
        y: anchor.y - opposite.y,
    };
    console.log('anchor op', sameRotation, anchor, opposite);
    const currentVec = {
        x: mouseWorldCurrent.x - opposite.x,
        y: mouseWorldCurrent.y - opposite.y,
    };
    // console.log('startVec',startVec)
    // console.log('currentVec',currentVec)
    // console.log(startVec, currentVec)
    let scaleX = startVec.x !== 0 ? currentVec.x / startVec.x : 1;
    let scaleY = startVec.y !== 0 ? currentVec.y / startVec.y : 1;
    if (shiftKey) {
        const uniformScale = Math.max(Math.abs(scaleX), Math.abs(scaleY));
        scaleX = Math.sign(scaleX) * uniformScale;
        scaleY = Math.sign(scaleY) * uniformScale;
    }
    const scalingAnchor = altKey ? { x: centerX, y: centerY } : opposite;
    // console.log(scaleX, scaleY,scalingAnchor)
    /*  elements.forEach((el: ElementInstance) => {
        scaleElementFrom(el, scaleX, scaleY, opposite)
        // el.scaleFrom(scaleX, scaleY, scalingAnchor)
      })*/
    elements.forEach((el) => {
        // console.log(scaleX, scaleY, opposite)
        const change = el.scaleFrom(scaleX, scaleY, scalingAnchor);
        changes.push(change);
    });
    return changes;
}
export default resizeFunc;
