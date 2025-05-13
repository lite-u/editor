const resetCanvas = (ctx, scale, offset, dpr) => {
    const transform = [
        scale, 0, 0, scale, offset.x, offset.y,
    ];
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width * dpr, ctx.canvas.height * dpr);
    ctx.setTransform(...transform);
};
export default resetCanvas;
