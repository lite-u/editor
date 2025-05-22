import {CenterBasedRect, Point} from '~/type'
import RectangleLike, {RectangleLikeProps} from '~/elements/rectangle/rectangleLike'

export interface RectangleProps extends RectangleLikeProps {
  type?: 'rectangle'
}

export type RequiredRectangleProps = Required<RectangleProps>

class ElementRectangle extends RectangleLike {
  readonly type = 'rectangle'

  constructor(props: RectangleProps) {
    super(props)
  }

  static create(p: Point, width: number = 10, height?: number) {
    const _height = height || width

    const props = {
      cx: p.x,
      cy: p.y,
      width,
      height: _height,
    }


  }

  override toJSON(): RequiredRectangleProps {
    return {
      ...super.toJSON(),
      type: this.type,
    }
  }

  override toMinimalJSON(): RectangleProps {
    return {
      ...super.toMinimalJSON(),
      type: this.type,
    }
  }

  public getRect(): CenterBasedRect {
    const {cx, cy, width, height} = this

    return {
      cx,
      cy,
      width,
      height,
    }
  }
}

export default ElementRectangle



