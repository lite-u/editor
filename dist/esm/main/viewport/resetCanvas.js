const resetCanvas = (ctx, scale, offset) => {
    const transform = [
        scale, 0, 0, scale, offset.x, offset.y,
    ];
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width * 2, ctx.canvas.height * 2);
    ctx.setTransform(...transform);
};
export default resetCanvas;
//# sourceMappingURL=resetCanvas.js.map