import ElementBase, { ElementBaseProps } from '~/elements/base/elementBase';
import { BasePath } from '~/elements/basePath/basePath';
import { Point } from '~/type';
export interface LineSegmentProps extends ElementBaseProps {
    id: string;
    layer: number;
    type: 'path';
    points: Point[];
}
export type RequiredLineSegmentProps = Required<LineSegmentProps>;
declare class LineSegment extends ElementBase implements BasePath {
    readonly id: string;
    readonly layer: number;
    readonly type = "path";
    private points;
    private original;
    constructor({ id, layer, points, ...rest }: LineSegmentProps);
    protected toJSON(): RequiredLineSegmentProps;
    toMinimalJSON(): LineSegmentProps;
}
export default LineSegment;
