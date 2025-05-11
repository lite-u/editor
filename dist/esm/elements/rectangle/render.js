const renderer = (rect, ctx) => {
    // const { x, y, width, height, fillColor } = this.getDetails();
    const { 
    // width,
    // height,
    radius, } = rect;
    let { x, y, width, height, rotation, opacity, fillColor, lineWidth, lineColor, dashLine } = rect.getDetails();
    // x = Math.round(x)
    // y = Math.round(y)
    // width = Math.round(width)
    // height = Math.round(height)
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
};
export default renderer;
