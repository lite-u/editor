import ElementShape, { ShapeProps } from '../shape/shape';
import { Point } from '~/type';
import { SnapPointData } from '~/main/type';
import ElementRectangle from '~/elements/rectangle/rectangle';
import { BorderRadius } from '~/elements/props';
import { HistoryChangeItem } from '~/services/actions/type';
export interface RectangleLikeProps extends ShapeProps {
    id: string;
    layer: number;
    width?: number;
    height?: number;
    borderRadius?: BorderRadius;
}
export type RequiredRectangleLikeProps = Required<RectangleLikeProps>;
declare class RectangleLike extends ElementShape {
    width: number;
    height: number;
    borderRadius: BorderRadius;
    constructor({ width, height, borderRadius, ...rest }: RectangleLikeProps);
    protected updatePath2D(): void;
    protected updateOriginal(): void;
    protected get getPoints(): Point[];
    protected get corners(): Point[];
    rotateFrom(ratation: number, anchor: Point): RectangleLike;
    scaleFrom(scaleX: number, scaleY: number, anchor: Point): HistoryChangeItem | undefined;
    toJSON(): RequiredRectangleLikeProps;
    toMinimalJSON(): RectangleLikeProps;
    getBoundingRect(): import("~/type").BoundingRect;
    getBoundingRectFromOriginal(): import("~/type").BoundingRect;
    getSelectedBoxElement(lineWidth: number, lineColor: string): ElementRectangle;
    getHighlightElement(lineWidth: number, lineColor: string): ElementRectangle;
    getOperators(id: string, resizeConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }, rotateConfig: {
        lineWidth: number;
        lineColor: string;
        size: number;
        fillColor: string;
    }): import("../../services/selection/type").OperationHandler[];
    getSnapPoints(): SnapPointData[];
}
export default RectangleLike;
