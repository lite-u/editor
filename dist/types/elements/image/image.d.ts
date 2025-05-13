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
        fillColor?: ElementFillColor;
        dashLine?: string;
        stroke?: Stroke;
        fill?: Fill;
        opacity?: number;
        shadow?: Shadow;
        rotation?: number;
        transform?: Transform;
    };
    renderImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement): void;
}
export default ElementImage;
