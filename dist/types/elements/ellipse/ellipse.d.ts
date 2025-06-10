import { Point, UID } from '~/type';
import ElementBase, { ElementBaseProps } from '~/elements/base/elementBase';
import ElementPath from '~/elements/path/path';
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
    scaleFrom(scaleX: number, scaleY: number, anchor: Point, appliedRotation: number): {
        id: string;
        type: string;
        from: Required<EllipseProps>;
        to: Required<import("~/elements/path/path").PathProps>;
    } | {
        id: string;
        from: {
            cx: number;
            cy: number;
            r1: number | undefined;
            r2: number | undefined;
        };
        to: {
            cx: number;
            cy: number;
            r1: number;
            r2: number;
        };
        type?: undefined;
    };
    toMinimalJSON(): EllipseProps;
    toJSON(): RequiredEllipseProps;
    toPath(): ElementPath;
    getBoundingRect(withoutRotation?: boolean): import("~/type").BoundingRect;
    getBoundingRectFromOriginal(withoutRotation?: boolean): import("~/type").BoundingRect;
}
export default ElementEllipse;
