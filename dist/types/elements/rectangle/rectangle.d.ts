import { CenterBasedRect, UID } from '~/type';
import RectangleLike, { RectangleLikeProps } from '~/elements/rectangle/rectangleLike';
export interface RectangleProps extends RectangleLikeProps {
    type?: 'rectangle';
}
export type RequiredRectangleProps = Required<RectangleProps>;
declare class ElementRectangle extends RectangleLike {
    readonly type = "rectangle";
    constructor(props: RectangleProps);
    static create(id: UID, cx: number, cy: number, width?: number, height?: number): ElementRectangle;
    toJSON(): RequiredRectangleProps;
    toMinimalJSON(): RectangleProps;
    getRect(): CenterBasedRect;
}
export default ElementRectangle;
