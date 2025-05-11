import Rectangle, {RectangleProps} from '../rectangle/rectangle'
import renderer from './renderer'

export type ImageProps = RectangleProps & {
  type?: 'image'
  src: string
}

export type RequiredImageProps = Required<ImageProps>

class ElementImage extends Rectangle {
  // readonly type = 'image'
  src: string

  constructor({
                src,
                ...rest
              }: ImageProps) {
    super(rest)

    this.src = src
  }

  get type(): 'image' {
    return 'image'
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
    }
  }

  public getOperators(
    id: string,
    resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
  ) {

    return super.getOperators(id, resizeConfig, rotateConfig)
  }

  render(ctx: CanvasRenderingContext2D, img: HTMLImageElement): void {
    super.render(ctx)
    renderer(this, ctx, img)
  }
}

export default ElementImage