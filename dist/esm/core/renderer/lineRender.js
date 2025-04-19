const lineRender = (ctx, rects) => {
    const lineQueue = new Set();
    const separateChar = ',';
    ctx.save();
    rects.forEach((props) => {
        const s = Object.values(props).join(separateChar);
        lineQueue.add(s);
    });
    let lastLineWidth = NaN;
    // let lastStrokeStyle = ''
    let lastFillStyle = '';
    const path = new Path2D();
    lineQueue.forEach((s) => {
        const arr = s.split(separateChar);
        const x0 = parseFloat(arr[0]);
        const y0 = parseFloat(arr[1]);
        const x1 = parseFloat(arr[2]);
        const y1 = parseFloat(arr[3]);
        const fillStyle = arr[4];
        const lineWidth = parseFloat(arr[5]);
        if (lineWidth !== lastLineWidth) {
            ctx.lineWidth = lineWidth;
            lastLineWidth = lineWidth;
        }
        if (fillStyle !== lastFillStyle) {
            ctx.fillStyle = fillStyle;
            lastFillStyle = fillStyle;
        }
        path.moveTo(x0, y0);
        path.lineTo(x1, y1);
    });
    ctx.stroke(path);
    ctx.restore();
};
export default lineRender;
//# sourceMappingURL=lineRender.js.map