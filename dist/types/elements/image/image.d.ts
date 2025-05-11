import Rectangle, { RectangleProps } from '../rectangle/rectangle';
export type ImageProps = RectangleProps & {
    type?: 'image';
    src: string;
};
export type RequiredImageProps = Required<ImageProps>;
declare class ElementImage extends Rectangle {
    src: string;
    constructor({ src, ...rest }: ImageProps);
    get type(): 'image';
    toJSON(): RequiredImageProps;
    toMinimalJSON(): {
        src: string;
        id: string;
        layer: number;
        width?: number;
        height?: number;
        radius?: number;
        x?: number;
        y?: number;
        enableGradient?: boolean;
        gradient?: string;
        enableFill?: boolean;
        fillColor?: import("../../type").ElementFillColor;
        dashLine?: string;
        enableLine?: boolean;
        lineColor?: CanvasRenderingContext2D["strokeStyle"];
        lineWidth?: CanvasRenderingContext2D["lineWidth"];
        opacity?: CanvasRenderingContext2D["globalAlpha"];
        enableShadow?: boolean;
        shadow?: string;
        rotation?: number;
    };
    getOperators(id: string, resizeConfig: {
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
