import { generateBoundingRectFromRotatedRect } from '../../core/utils.js';
import Shape from '../shape/shape.js';
import Rectangle from './rectangle';
import { getResizeTransform } from '../../core/lib.js';
class Ellipse extends Shape {
    // type = 'ellipse'
    r1;
    r2;
    fillColor;
    enableFill;
    constructor({ fillColor, enableFill = true, r1, r2, ...rest }) {
        super({ type: 'rectangle', ...rest });
        this.r1 = r1;
        this.r2 = r2;
        this.fillColor = fillColor;
        this.enableFill = enableFill;
    }
    static applyResizeTransform = ({ downPoint, movePoint, moduleOrigin, rotation, handleName, scale, dpr, altKey = false, shiftKey = false, }) => {
        const { r1, r2, x: initialCX, y: initialCY, } = moduleOrigin;
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
    hitTest(point, borderPadding = 5) {
        const { x: cx, y: cy, r1, r2, rotation = 0 } = this;
        const cos = Math.cos(-rotation);
        const sin = Math.sin(-rotation);
        const dx = point.x - cx;
        const dy = point.y - cy;
        const localX = dx * cos - dy * sin;
        const localY = dx * sin + dy * cos;
        // Ellipse equation: (x^2 / a^2) + (y^2 / b^2)
        const norm = (localX * localX) / (r1 * r1) + (localY * localY) / (r2 * r2);
        const borderRange = borderPadding / Math.min(r1, r2); // normalized padding
        if (norm <= 1 + borderRange) {
            if (norm >= 1 - borderRange) {
                return 'border';
            }
            return 'inside';
        }
        return null;
    }
    getDetails(includeIdentifiers = true) {
        return {
            ...super.getDetails(includeIdentifiers),
            type: 'ellipse',
            fillColor: this.fillColor,
            enableFill: this.enableFill,
            r1: this.r1,
            r2: this.r2,
        };
    }
    getBoundingRect() {
        const { x: cx, y: cy, r1, r2, rotation } = this;
        return generateBoundingRectFromRotatedRect({
            x: cx - r1,
            y: cy - r2,
            width: r1 * 2,
            height: r2 * 2,
        }, rotation);
    }
    getRect() {
        const { x, y, r1, r2 } = this;
        return {
            x,
            y,
            width: r1 * 2,
            height: r2 * 2,
        };
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
        const { x, y, r1, r2, rotation, layer, id } = this;
        return new Ellipse({
            x,
            y,
            r1,
            r2,
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
        const { x: cx, y: cy, r1, r2, id } = this;
        // Define snap points: center, cardinal edge points (top, right, bottom, left)
        const points = [
            { id, x: cx, y: cy, type: 'center' },
            { id, x: cx, y: cy - r2, type: 'edge-top' },
            { id, x: cx + r1, y: cy, type: 'edge-right' },
            { id, x: cx, y: cy + r2, type: 'edge-bottom' },
            { id, x: cx - r1, y: cy, type: 'edge-left' },
        ];
        return points;
    }
    render(ctx) {
        let { x, y, r1, r2, opacity, fillColor, rotation, dashLine, gradient } = this.getDetails();
        const { lineWidth, lineColor, } = super.getDetails();
        // x = Math.round(x)
        // y = Math.round(y)
        // r1 = Math.round(r1)
        // r2 = Math.round(r2)
        // Save current context state to avoid transformations affecting other drawings
        ctx.save();
        // Move context to the circle's center
        ctx.translate(x, y);
        // Apply rotation if needed
        if (rotation !== 0) {
            ctx.rotate(rotation * Math.PI / 180); // Convert to radians
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
            ctx.lineJoin = 'round';
        }
        // Draw circle
        ctx.beginPath();
        ctx.ellipse(0, 0, r1, r2, 0, 0, Math.PI * 2); // Ellipse for circle (can use same radius for both axes)
        if (dashLine) {
            ctx.setLineDash([3, 5]); // Apply dashed line pattern
        }
        else {
            ctx.setLineDash([]); // Reset line dash if no dashLine
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
        // Apply gradient if provided
        if (gradient) {
            ctx.fillStyle = gradient; // Use gradient for fill
            if (opacity > 0) {
                ctx.fill(); // Fill with gradient
            }
        }
        // Restore the context to avoid affecting subsequent drawings
        ctx.restore();
    }
}
export default Ellipse;
