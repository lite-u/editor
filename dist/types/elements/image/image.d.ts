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
        stroke?: import("../props").Stroke;
        fill?: import("../props").Fill;
        opacity?: number;
        shadow?: import("../props").Shadow;
        rotation?: number;
        transform?: import("../props").Transform;
    };
    renderImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement): void;
}
export default ElementImage;
