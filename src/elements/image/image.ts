import render from './render'
import RectangleLike, {RectangleLikeProps} from '~/elements/rectangle/rectangleLike'

export interface ImageProps extends RectangleLikeProps {
  type?: 'image'
  src?: string
}

export type RequiredImageProps = Required<ImageProps>
const DEFAULT_SRC = ''

class ElementImage extends RectangleLike {
  readonly type = 'image'
  src: string

  constructor({
                src = DEFAULT_SRC,
                ...rest
              }: ImageProps) {
    super(rest)

    this.src = src
  }

  public toJSON(): RequiredImageProps {
    return {
      src: this.src,
      type: this.type,
      ...super.toJSON(),
    }
  }

  public toMinimalJSON() {
    return {
      ...super.toMinimalJSON(),
      src: this.src,
      type: this.type,
    }
  }

  public renderImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement): void {
    render.call(this, ctx, img)
  }
}

export default ElementImage