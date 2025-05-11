import RectangleLike, { RectangleLikeProps } from '~/elements/rectangle/rectangleLike';
export interface ImageProps extends RectangleLikeProps {
    type?: 'image';
    src?: string;
}
export type RequiredImageProps = Required<ImageProps>;
declare class ElementImage extends RectangleLike {
    readonly type = "image";
    src: string;
    constructor({ src, ...rest }: ImageProps);
    toJSON(): RequiredImageProps;
    toMinimalJSON(): {
        src: string;
        type: string;
        id: string;
        layer: number;
        width?: number;
        height?: number;
        radius?: number;
        cx?: number;
        cy?: number;
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
    renderImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement): void;
}
export default ElementImage;
