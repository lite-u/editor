"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deduplicate_ts_1 = __importDefault(require("./deduplicate.ts"));
const utils_ts_1 = require("../utils.ts");
const circleRender = (ctx, circles) => {
    let uintArray = circles;
    if (uintArray.length > 1000) {
        uintArray = circles.map(item => {
            return (0, utils_ts_1.setFloatOnProps)(item, ['x', 'y', 'r1', 'r2']);
        });
    }
    const circleQueue = (0, deduplicate_ts_1.default)(uintArray);
    ctx.save();
    // console.log(circleQueue)
    circleQueue.forEach(({ x, y, r1, r2, fillColor = '', lineColor = '', lineWidth = 1, opacity = 100, gradient, rotation = 0, dashLine = '', }) => {
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
    });
    /*
      console.log(`
        Total Rectangles to Render: ${rects.length}
        Rectangles in Queue: ${rectQueue.length}
      `);*/
};
exports.default = circleRender;
