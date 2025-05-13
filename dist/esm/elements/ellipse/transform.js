import { getResizeTransform } from '../../lib/lib.js';
const transform = ({ downPoint, movePoint, elementOrigin, rotation, handleName, scale, dpr, altKey = false, shiftKey = false, }) => {
    const { r1, r2, cx: initialCX, cy: initialCY, } = elementOrigin;
    const initialWidth = r1 * 2;
    const initialHeight = r2 * 2;
    // Calculate raw movement in screen coordinates
    const dxScreen = movePoint.x - downPoint.x;
    const dyScreen = movePoint.y - downPoint.y;
    // Convert to canvas coordinates and apply DPR
    const dx = (dxScreen / scale) * dpr;
    const dy = (dyScreen / scale) * dpr;
    // Convert rotation to radians and calculate rotation matrix
    const angle = -rotation * (Math.PI / 180);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    // Transform the movement vector into the object's local coordinate system
    const localDX = dx * cos - dy * sin;
    const localDY = dx * sin + dy * cos;
    // Get the resize transform based on the handle
    const t = getResizeTransform(handleName, altKey);
    // Calculate the size changes in local coordinates
    let deltaX = localDX * t.dx;
    let deltaY = localDY * t.dy;
    // Maintain aspect ratio if shift key is pressed
    if (shiftKey) {
        const aspect = initialWidth / initialHeight;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        // For corner handles, use the larger movement
        if (t.dx !== 0 && t.dy !== 0) {
            if (absDeltaX > absDeltaY) {
                deltaY = deltaX / aspect;
            }
            else {
                deltaX = deltaY * aspect;
            }
        }
        // For horizontal handles, maintain aspect ratio based on width change
        else if (t.dx !== 0) {
            deltaY = deltaX / aspect;
        }
        // For vertical handles, maintain aspect ratio based on height change
        else if (t.dy !== 0) {
            deltaX = deltaY * aspect;
        }
    }
    // Apply the resize transform
    const factor = altKey ? 2 : 1;
    const width = Math.abs(initialWidth + deltaX * factor);
    const height = Math.abs(initialHeight + deltaY * factor);
    // Calculate the center movement in local coordinates
    const centerDeltaX = -deltaX * t.cx * factor;
    const centerDeltaY = -deltaY * t.cy * factor;
    // Transform the center movement back to global coordinates
    const globalCenterDeltaX = centerDeltaX * cos + centerDeltaY * sin;
    const globalCenterDeltaY = -centerDeltaX * sin + centerDeltaY * cos;
    // Calculate the new center position
    const x = initialCX + globalCenterDeltaX;
    const y = initialCY + globalCenterDeltaY;
    console.log();
    return { x, y, r1: width / 2, r2: height / 2 };
};
export default transform;
