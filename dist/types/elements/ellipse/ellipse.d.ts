import { Point, UID } from '~/type';
import ElementBase, { ElementBaseProps } from '~/elements/base/elementBase';
export interface EllipseProps extends ElementBaseProps {
    type?: 'ellipse';
    r1: number;
    r2: number;
    startAngle?: number;
    endAngle?: number;
}
export type RequiredEllipseProps = Required<EllipseProps>;
declare class ElementEllipse extends ElementBase {
    readonly type = "ellipse";
    r1: number;
    r2: number;
    startAngle: number;
    endAngle: number;
    constructor({ r1, r2, startAngle, endAngle, ...rest }: EllipseProps);
    static create(id: UID, cx: number, cy: number, r1?: number, r2?: number): ElementEllipse;
    get getPoints(): Point[];
    updatePath2D(): void;
    updateOriginal(): void;
    scaleFrom(scaleX: number, scaleY: number, anchor: Point): void;
    toMinimalJSON(): EllipseProps;
    toJSON(): RequiredEllipseProps;
    getBoundingRect(withoutRotation?: boolean): import("~/type").BoundingRect;
    getBoundingRectFromOriginal(withoutRotation?: boolean): import("~/type").BoundingRect;
}
export default ElementEllipse;
