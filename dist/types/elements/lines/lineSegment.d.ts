import ElementBase, { ElementBaseProps } from '~/elements/base/elementBase';
import { BasePath } from '~/elements/basePath/basePath';
import { Point } from '~/type';
export interface LineSegmentProps extends ElementBaseProps {
    id: string;
    layer: number;
    type: 'lineSegment';
    points: Point[];
}
export type RequiredLineSegmentProps = Required<LineSegmentProps>;
declare class ElementLineSegment extends ElementBase implements BasePath {
    readonly id: string;
    readonly layer: number;
    readonly type = "lineSegment";
    private points;
    private original;
    constructor({ id, layer, points, ...rest }: LineSegmentProps);
    protected getPoints(): Point[];
    translate(dx: number, dy: number): void;
    scaleFrom(scaleX: number, scaleY: number, anchor: Point): void;
    protected toJSON(): RequiredLineSegmentProps;
    toMinimalJSON(): LineSegmentProps;
    render(): void;
}
export default ElementLineSegment;
