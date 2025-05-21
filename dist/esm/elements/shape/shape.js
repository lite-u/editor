import ElementBase from '../base/elementBase.js';
import { DEFAULT_CX, DEFAULT_CY, DEFAULT_GRADIENT } from '../defaultProps.js';
/*export interface ShapeProps extends ElementBaseProps {
  cx?: number
  cy?: number
  gradient?: Gradient
}*/
// export type RequiredShapeProps = Required<ShapeProps>
class ElementShape extends ElementBase {
    cx;
    cy;
    gradient;
    /*  protected original: {
        cx: number;
        cy: number;
        rotation: number,
        points?: BezierPoint[],
        width?: number,
        height?: number,
        r1?: number,
        r2?: number,
        closed?: boolean,
        [key: string]: unknown
      }*/
    constructor({ cx = DEFAULT_CX, cy = DEFAULT_CY, gradient = DEFAULT_GRADIENT, ...rest }) {
        super(rest);
        /* this.cx = cx
         this.cy = cy
         this.original = {
           cx: this.cx,
           cy: this.cy,
           rotation: this.rotation,
         }
         this.gradient = gradient*/
    }
}
export default ElementShape;
