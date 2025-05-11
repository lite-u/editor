import Rectangle, { RectangleProps } from './rectangle';
export interface ImageProps extends RectangleProps {
    type: 'image';
    src: string;
}
declare class ElementImage extends Rectangle {
    src: string;
    constructor({ src, ...rest }: Omit<ImageProps, 'type'>);
    getDetails<T extends boolean>(includeIdentifiers?: T): T extends true ? RectangleProps : Omit<RectangleProps, 'id' & 'layer'>;
    getOperators(resizeConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }, rotateConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }): import("../../engine/selection/type").OperationHandlers[];
    render(ctx: CanvasRenderingContext2D, img: HTMLImageElement): void;
}
export default ElementImage;
