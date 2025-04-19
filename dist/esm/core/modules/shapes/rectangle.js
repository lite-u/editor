import Shape from './shape';
import { generateBoundingRectFromRotatedRect } from '../../utils';
import { getResizeTransform } from '../../../lib/lib';
class Rectangle extends Shape {
    constructor({ width, height, radius = 0, ...rest }) {
        super({ ...rest });
        this.type = 'rectangle';
        this.width = width;
        this.height = height;
        this.radius = radius;
    }
    hitTest(point, borderPadding = 5) {
        const { x: cx, y: cy, width, height, rotation = 0 } = this;
        const cos = Math.cos(-rotation);
        const sin = Math.sin(-rotation);
        const dx = point.x - cx;
        const dy = point.y - cy;
        // Rotate the point into the rectangle's local space
        const localX = dx * cos + dy * sin;
        const localY = -dx * sin + dy * cos;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const withinX = localX >= -halfWidth && localX <= halfWidth;
        const withinY = localY >= -halfHeight && localY <= halfHeight;
        if (withinX && withinY) {
            const nearLeft = Math.abs(localX + halfWidth) <= borderPadding;
            const nearRight = Math.abs(localX - halfWidth) <= borderPadding;
            const nearTop = Math.abs(localY + halfHeight) <= borderPadding;
            const nearBottom = Math.abs(localY - halfHeight) <= borderPadding;
            if (nearLeft || nearRight || nearTop || nearBottom) {
                return 'border';
            }
            return 'inside';
        }
        return null;
    }
    getDetails(includeIdentifiers = true) {
        return {
            type: this.type,
            width: this.width,
            height: this.height,
            ...super.getDetails(includeIdentifiers),
        };
    }
    getRect() {
        const { x, y, width, height } = this;
        return {
            x,
            y,
            width,
            height,
        };
    }
    getBoundingRect() {
        const { x: cx, y: cy, width, height, rotation } = this;
        const x = cx - width / 2;
        const y = cy - height / 2;
        if (rotation === 0) {
            return {
                x,
                y,
                width,
                height,
                left: x,
                top: y,
                right: x + width,
                bottom: y + height,
                cx,
                cy,
            };
        }
        return generateBoundingRectFromRotatedRect({ x, y, width, height }, rotation);
    }
    getSelectedBoxModule(lineWidth, lineColor) {
        const { id, rotation, layer } = this;
        const rectProp = {
            ...this.getRect(),
            lineColor,
            lineWidth,
            rotation,
            layer,
            id: id + '-selected-box',
            opacity: 0,
        };
        return new Rectangle(rectProp);
    }
    getHighlightModule(lineWidth, lineColor) {
        const { x, y, width, height, rotation, layer, id } = this;
        return new Rectangle({
            x,
            y,
            width,
            height,
            // fillColor,
            lineColor,
            lineWidth,
            rotation,
            layer,
            id: id + 'highlight',
            opacity: 0,
        });
    }
    getOperators(resizeConfig, rotateConfig) {
        return super.getOperators(resizeConfig, rotateConfig, this.getRect(), this.getDetails(true));
    }
    getSnapPoints() {
        const { x: cx, y: cy, width, height, id } = this;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        // Define basic snap points: center, corners, and edge centers
        const points = [
            { id, x: cx, y: cy, type: 'center' },
            { id, x: cx - halfWidth, y: cy - halfHeight, type: 'corner-tl' },
            { id, x: cx + halfWidth, y: cy - halfHeight, type: 'corner-tr' },
            { id, x: cx + halfWidth, y: cy + halfHeight, type: 'corner-br' },
            { id, x: cx - halfWidth, y: cy + halfHeight, type: 'corner-bl' },
            { id, x: cx, y: cy - halfHeight, type: 'edge-top' },
            { id, x: cx + halfWidth, y: cy, type: 'edge-right' },
            { id, x: cx, y: cy + halfHeight, type: 'edge-bottom' },
            { id, x: cx - halfWidth, y: cy, type: 'edge-left' },
        ];
        return points;
    }
    render(ctx) {
        // const { x, y, width, height, fillColor } = this.getDetails();
        const { 
        // width,
        // height,
        radius, } = this;
        let { x, y, width, height, rotation, opacity, fillColor, lineWidth, lineColor, dashLine } = this.getDetails();
        x = Math.round(x);
        y = Math.round(y);
        width = Math.round(width);
        height = Math.round(height);
        // console.log(x, y, width, height)
        const LocalX = width / 2;
        const LocalY = height / 2;
        // Save current context state to avoid transformations affecting other drawings
        ctx.save();
        // Move context to the rectangle's center (Direct center point at x, y)
        ctx.translate(x, y);
        // Apply rotation if needed
        if (rotation > 0) {
            ctx.rotate(rotation * Math.PI / 180);
        }
        // Apply fill style if enabled
        if (opacity > 0) {
            ctx.fillStyle = fillColor;
            ctx.globalAlpha = opacity / 100; // Set the opacity
        }
        // Apply stroke style if enabled
        if (lineWidth > 0) {
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = lineColor;
            ctx.lineJoin = 'miter';
        }
        // return
        // Draw a rounded rectangle or regular rectangle
        ctx.beginPath();
        if (dashLine) {
            ctx.setLineDash([3, 5]);
        }
        if (radius > 0) {
            // Use arcTo for rounded corners
            ctx.moveTo(-LocalX + radius, -LocalY);
            ctx.arcTo(LocalX, -LocalY, LocalX, LocalY, radius);
            ctx.arcTo(LocalX, LocalY, -LocalX, LocalY, radius);
            ctx.arcTo(-LocalX, LocalY, -LocalX, -LocalY, radius);
            ctx.arcTo(-LocalX, -LocalY, LocalX, -LocalY, radius);
        }
        else {
            // For square/rectangular modules with no rounded corners
            ctx.rect(-LocalX, -LocalY, width, height);
        }
        ctx.closePath();
        // Fill if enabled
        if (opacity > 0) {
            ctx.fill();
        }
        // Stroke if enabled
        if (lineWidth > 0) {
            ctx.stroke();
        }
        /*   if (gradient) {
             // Implement gradient rendering (as needed)
           }*/
        // Restore the context to avoid affecting subsequent drawings
        ctx.restore();
    }
}
Rectangle.applyResizeTransform = ({ downPoint, movePoint, moduleOrigin, rotation, handleName, scale, dpr, altKey = false, shiftKey = false, }) => {
    const { width: initialWidth, height: initialHeight, x: initialCX, y: initialCY, } = moduleOrigin;
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
    return { x, y, width, height };
};
export default Rectangle;
//# sourceMappingURL=rectangle.js.map