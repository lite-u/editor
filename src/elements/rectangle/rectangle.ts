// import {ResizeHandleName} from '~/engine/selection/type'
import {CenterBasedRect} from '~/type'
import {ModuleInstance} from '../elements'
import {SnapPointData} from '~/engine/type'
// import {getResizeTransform} from '~/core/lib'
import {generateBoundingRectFromRect, generateBoundingRectFromRotatedRect} from '~/core/utils'
import renderer from './renderer'
import RectangleLike, {RequiredRectangleLikeProps} from '~/elements/rectangle/rectangleLike'

// import RectangleLikeAbstract from '~/elements/rectangle/abstract'

export interface RectangleProps extends RequiredRectangleLikeProps {
  type?: 'rectangle'
}

export type RequiredRectangleProps = Required<RectangleProps>

class Rectangle extends RectangleLike {
  readonly type = 'rectangle'

  constructor(props: RectangleProps) {
    super(props)
  }

  /*
    static applyResizeTransform = (arg: TransformProps): Rect => {
      return transform(arg)
    }*/

  /*
    public hitTest(point: Point, borderPadding = 5): 'inside' | 'border' | null {
    }
  */

  override toJSON(): RequiredRectangleProps {
    return {
      ...super.toJSON(),
      type: this.type,
    }
  }

  override toMinimalJSON(): RectangleProps {

    return {
      ...super.toMinimalJSON(),
      type: 'rectangle',
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

/*
  public getBoundingRect() {
  }
*/

/*
  public getSelectedBoxModule(lineWidth: number, lineColor: string): Rectangle {
  }
*/

/*
  public getHighlightModule(lineWidth: number, lineColor: string): ModuleInstance {
  }
*/

  /*  public getOperators(
      id: string,
      resizeConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
      rotateConfig: { lineWidth: number, lineColor: string, size: number, fillColor: string },
    ) {

      return super.getOperators(id, resizeConfig, rotateConfig, this.getRect(), this.toJSON())
    }*/

/*
  public getSnapPoints(): SnapPointData[] {
  }
*/
/*
  render(ctx: CanvasRenderingContext2D): void {
    renderer(this, ctx)
  }*/
}

export default Rectangle




