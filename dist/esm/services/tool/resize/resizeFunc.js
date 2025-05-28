import { getAnchorsByResizeDirection, getBoundingRectFromBoundingRects } from '~/services/tool/resize/helper';
// import Editor from '~/main/editor'
function resizeFunc(elements, placement = 'br') {
    const changes = [];
    const { interaction /*action*/ } = this.editor;
    const { mouseWorldCurrent, _modifier } = interaction;
    const { altKey, shiftKey } = _modifier;
    const rect = getBoundingRectFromBoundingRects(elements.map(el => el.getBoundingRectFromOriginal()));
    const { anchor, opposite } = getAnchorsByResizeDirection(rect, placement);
    const centerX = rect.cx;
    const centerY = rect.cy;
    // console.log(anchor)
    const startVec = {
        x: anchor.x - opposite.x,
        y: anchor.y - opposite.y,
    };
    // console.log(rect)
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
    const scalingAnchor = altKey
        ? { x: centerX, y: centerY }
        : anchor;
    // console.log(scaleX, scaleY,scalingAnchor)
    /*  elements.forEach((el: ElementInstance) => {
        scaleElementFrom(el, scaleX, scaleY, opposite)
        // el.scaleFrom(scaleX, scaleY, scalingAnchor)
      })*/
    elements.forEach((el) => {
        // console.log(scaleX, scaleY, opposite)
        const change = el.scaleFrom(scaleX, scaleY, opposite);
        changes.push(change);
    });
    return changes;
}
export default resizeFunc;
