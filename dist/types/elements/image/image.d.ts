import RectangleLike, { RectangleLikeProps } from '~/elements/rectangle/rectangleLike';
import { Asset } from '~/elements/props';
export interface ImageProps extends RectangleLikeProps {
    type?: 'image';
    asset: Asset;
}
export type RequiredImageProps = Required<ImageProps>;
declare class ElementImage extends RectangleLike {
    readonly type = "image";
    asset: Asset;
    constructor({ asset, ...rest }: ImageProps);
    toJSON(): RequiredImageProps;
    toMinimalJSON(): ImageProps;
    render(ctx: CanvasRenderingContext2D): void;
}
export default ElementImage;
