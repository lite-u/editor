interface DrawGridParams {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    gridSize?: number;
    lineWidth: number;
    strokeStyle?: string;
}
/**
 * Draws a grid on the given canvas context.
 *
 * @param ctx The canvas context to draw on.
 * @param width The width of the canvas.
 * @param height The height of the canvas.
 * @param gridSize The size of each grid cell. Defaults to 50.
 */
declare function drawGrid({ ctx, width, height, gridSize, lineWidth, strokeStyle }: DrawGridParams): void;
export default drawGrid;
