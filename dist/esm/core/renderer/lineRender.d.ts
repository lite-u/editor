export interface LineRenderProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    fillStyle: string;
    lineWidth: number;
}
declare const lineRender: (ctx: CanvasRenderingContext2D, rects: LineRenderProps[]) => void;
export default lineRender;
