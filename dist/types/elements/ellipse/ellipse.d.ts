import { Point } from '~/type';
import ElementBase, { ElementBaseProps } from '~/elements/base/elementBase';
export interface EllipseProps extends ElementBaseProps {
    type?: 'ellipse';
    r1: number;
    r2: number;
}
export type RequiredEllipseProps = Required<EllipseProps>;
declare class ElementEllipse extends ElementBase {
    readonly type = "ellipse";
    r1: number;
    r2: number;
    constructor({ r1, r2, ...rest }: EllipseProps);
    get getPoints(): Point[];
    protected updatePath2D(): void;
    protected updateOriginal(): void;
    scaleFrom(scaleX: number, scaleY: number, anchor: Point): void;
    toMinimalJSON(): EllipseProps;
    toJSON(): RequiredEllipseProps;
    getBoundingRect(withoutRotation?: boolean): import("~/type").BoundingRect;
    getBoundingRectFromOriginal(): import("~/type").BoundingRect;
}
export default ElementEllipse;
