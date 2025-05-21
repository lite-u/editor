import ElementBase from '../base/elementBase';
import { Gradient } from '~/elements/props';
declare class ElementShape extends ElementBase {
    cx: number;
    cy: number;
    gradient: Gradient;
    constructor({ cx, cy, gradient, ...rest }: ShapeProps);
}
export default ElementShape;
