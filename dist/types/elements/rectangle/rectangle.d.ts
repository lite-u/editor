import { CenterBasedRect } from '~/type';
import RectangleLike, { RectangleLikeProps } from '~/elements/rectangle/rectangleLike';
export interface RectangleProps extends RectangleLikeProps {
    type?: 'rectangle';
}
export type RequiredRectangleProps = Required<RectangleProps>;
declare class Rectangle extends RectangleLike {
    readonly type = "rectangle";
    constructor(props: RectangleProps);
    toJSON(): RequiredRectangleProps;
    toMinimalJSON(): RectangleProps;
    getRect(): CenterBasedRect;
}
export default Rectangle;
