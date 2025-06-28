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
        id: any;
        type: string;
        from: Required<EllipseProps>;
        to: any;
    } | {
        id: any;
        from: {
            cx: any;
            cy: any;
            r1: any;
            r2: any;
        };
        to: {
            cx: any;
            cy: any;
            r1: number;
            r2: number;
        };
        type?: undefined;
    };
    toMinimalJSON(): EllipseProps;
    toJSON(): RequiredEllipseProps;
    toPath(): ElementPath;
    getBoundingRect(withoutRotation?: boolean): any;
    getBoundingRectFromOriginal(withoutRotation?: boolean): any;
}
export default ElementEllipse;
