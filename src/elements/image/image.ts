import render from './render'
import RectangleLike, {RectangleLikeProps} from '~/elements/rectangle/rectangleLike'

export interface ImageProps extends RectangleLikeProps {
  type?: 'image'
  asset: Asset
}

export type RequiredImageProps = Required<ImageProps>

class ElementImage extends RectangleLike {
  readonly type = 'image'
  asset: Asset

  constructor({
                asset,
                ...rest
              }: ImageProps) {
    super(rest)

    this.asset = asset
  }

  public toJSON(): RequiredImageProps {
    return {
      asset: this.asset,
      type: this.type,
      ...super.toJSON(),
    }
  }

  public toMinimalJSON() {
    return {
      ...super.toMinimalJSON(),
      src: this.asset,
      type: this.type,
    }
  }

  public renderImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement): void {
    render.call(this, ctx, img)
  }
}

export default ElementImage