import RectangleLike from './rectangleLike.js';
class Rectangle extends RectangleLike {
    type = 'rectangle';
    constructor(props) {
        super(props);
    }
    /*
      static applyResizeTransform = (arg: TransformProps): Rect => {
        return transform(arg)
      }*/
    /*
      public hitTest(point: Point, borderPadding = 5): 'inside' | 'border' | null {
      }
    */
    toJSON() {
        return {
            ...super.toJSON(),
            type: this.type,
        };
    }
    toMinimalJSON() {
        return {
            ...super.toMinimalJSON(),
            type: 'rectangle',
        };
    }
    getRect() {
        const { cx, cy, width, height } = this;
        return {
            cx,
            cy,
            width,
            height,
        };
    }
}
export default Rectangle;
