import { Point } from '~/type';
import { BorderRadius } from '~/elements/props';
import { HistoryChangeItem } from '~/services/actions/type';
import ElementBase, { ElementBaseProps } from '~/elements/base/elementBase';
import ElementPath from '~/elements/path/path';
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
    scaleFrom(scaleX: number, scaleY: number, anchor: Point, appliedRotation: number): HistoryChangeItem | undefined;
    toJSON(): RequiredRectangleLikeProps;
    toMinimalJSON(): RectangleLikeProps;
    toPath(): ElementPath;
    getBoundingRect(withoutRotation?: boolean): any;
    getBoundingRectFromOriginal(withoutRotation?: boolean): any;
}
export default RectangleLike;
