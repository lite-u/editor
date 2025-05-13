export type TransformType = [
    horizontalScaling: number,
    verticalSkewing: number,
    horizontalSkewing: number,
    verticalScaling: number,
    horizontalTranslation: number,
    verticalTranslation: number
];
declare const resetCanvas: (ctx: CanvasRenderingContext2D, scale: number, offset: {
    x: number;
    y: number;
}, dpr: number) => void;
export default resetCanvas;
