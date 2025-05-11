import Rectangle, {RectangleProps} from '../rectangle/rectangle'
import renderer from './renderer'

export interface ImageProps extends RectangleProps {
  type: 'image'
  src: string
}

class ElementImage extends Rectangle {
  readonly type = 'image'
  src: string

  constructor({
                src,
                ...rest
              }: Omit<ImageProps, 'type'>) {
    super({...rest})

    this.src = src
  }

  public toJSON<T extends boolean>(includeIdentifiers: T = true as T): T extends true ? RectangleProps : Omit<RectangleProps, 'id' & 'layer'> {
    return {
      src: this.src,
      ...super.toJSON(includeIdentifiers),
    } as T extends true ? RectangleProps : Omit<RectangleProps, 'id' & 'layer'>
  }

  public toMinimalJSON<T extends boolean>(includeIdentifiers: T = true as T): T extends true ? RectangleProps : Omit<RectangleProps, 'id' & 'layer'> {
    return {
      src: this.src,
      ...super.toMinimalJSON(includeIdentifiers),
    } as T extends true ? RectangleProps : Omit<RectangleProps, 'id' & 'layer'>
  }

  public getOperators(
    resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
  ) {

    return super.getOperators(resizeConfig, rotateConfig, this.getRect(), this.toMinimalJSON(true))
  }

  render(ctx: CanvasRenderingContext2D, img: HTMLImageElement): void {
    renderer(this, ctx, img)
  }
}

export default ElementImage