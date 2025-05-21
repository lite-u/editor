import { getAnchorsByResizeDirection, getBoundingRectFromBoundingRects } from './helper.js';
function resizeFunc(elements, direction = 'br') {
    console.log(direction);
    const { interaction /*action*/ } = this.editor;
    const { mouseWorldCurrent, _modifier } = interaction;
    const { altKey, shiftKey } = _modifier;
    const rect = getBoundingRectFromBoundingRects(elements.map(el => el.getBoundingRectFromOriginal()));
    const { anchor, opposite } = getAnchorsByResizeDirection(rect, direction);
    // const startPoint
    const centerX = rect.cx;
    const centerY = rect.cy;
    // console.log(anchor)
    const startVec = {
        x: opposite.x - anchor.x,
        y: opposite.y - anchor.y,
    };
    // console.log(rect)
    const currentVec = {
        x: mouseWorldCurrent.x - anchor.x,
        y: mouseWorldCurrent.y - anchor.y,
    };
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
    elements.forEach((el) => {
        el.scaleFrom(scaleX, scaleY, scalingAnchor);
    });
}
export default resizeFunc;
