import {CenterBasedRect} from '~/type'
import RectangleLike, {RectangleLikeProps} from '~/elements/rectangle/rectangleLike'

export interface RectangleProps extends RectangleLikeProps {
  type?: 'rectangle'
}

export type RequiredRectangleProps = Required<RectangleProps>
export type I = InstanceType<ElementRectangle>

class ElementRectangle extends RectangleLike {
  readonly type = 'rectangle'

  constructor(props: RectangleProps) {
    super(props)
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



