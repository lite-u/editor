import { Point } from '~/type';
import { SnapPointData } from '~/main/type';
import ElementRectangle from '~/elements/rectangle/rectangle';
import { BorderRadius } from '~/elements/props';
import { HistoryChangeItem } from '~/services/actions/type';
import ElementBase, { ElementBaseProps } from '~/elements/base/elementBase';
export interface RectangleLikeProps extends ElementBaseProps {
    id: string;
    layer: number;
    width?: number;
    height?: number;
    borderRadius?: BorderRadius;
}
export type RequiredRectangleLikeProps = Required<RectangleLikeProps>;
declare class RectangleLike extends ElementBase {
    width: number;
    height: number;
    borderRadius: BorderRadius;
    constructor({ width, height, borderRadius, ...rest }: RectangleLikeProps);
    protected updatePath2D(): void;
    protected updateOriginal(): void;
    protected get getPoints(): Point[];
    protected get corners(): Point[];
    scaleFrom(scaleX: number, scaleY: number, anchor: Point): HistoryChangeItem | undefined;
    toJSON(): RequiredRectangleLikeProps;
    toMinimalJSON(): RectangleLikeProps;
    getBoundingRect(withoutRotation?: boolean): import("~/type").BoundingRect;
    getBoundingRectFromOriginal(): import("~/type").BoundingRect;
    getSelectedBoxElement(lineWidth: number, lineColor: string): ElementRectangle;
    getHighlightElement(lineWidth: number, lineColor: string): ElementRectangle;
    getSnapPoints(): SnapPointData[];
}
export default RectangleLike;
