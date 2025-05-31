import { Point } from '~/type';
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
    updatePath2D(): void;
    updateOriginal(): void;
    protected get getPoints(): Point[];
    protected get corners(): Point[];
    scaleFrom(scaleX: number, scaleY: number, anchor: Point, center: Point, applyRotation: any): HistoryChangeItem | undefined;
    toJSON(): RequiredRectangleLikeProps;
    toMinimalJSON(): RectangleLikeProps;
    getBoundingRect(withoutRotation?: boolean): import("~/type").BoundingRect;
    getBoundingRectFromOriginal(withoutRotation?: boolean): import("~/type").BoundingRect;
}
export default RectangleLike;
