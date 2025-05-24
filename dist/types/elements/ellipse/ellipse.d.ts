import { Point, UID } from '~/type';
import ElementBase, { ElementBaseProps } from '~/elements/base/elementBase';
export interface EllipseProps extends ElementBaseProps {
    type?: 'ellipse';
    r1: number;
    r2: number;
    fan?: boolean;
}
export type RequiredEllipseProps = Required<EllipseProps>;
declare class ElementEllipse extends ElementBase {
    readonly type = "ellipse";
    r1: number;
    r2: number;
    startAngle: number;
    endAngle: number;
    fan: boolean;
    constructor({ r1, r2, ...rest }: EllipseProps);
    static create(id: UID, cx: number, cy: number, r1?: number, r2?: number): ElementEllipse;
    get getPoints(): Point[];
    updatePath2D(): void;
    protected updateOriginal(): void;
    scaleFrom(scaleX: number, scaleY: number, anchor: Point): void;
    toMinimalJSON(): EllipseProps;
    toJSON(): RequiredEllipseProps;
    getBoundingRect(withoutRotation?: boolean): import("~/type").BoundingRect;
    getBoundingRectFromOriginal(): import("~/type").BoundingRect;
}
export default ElementEllipse;
