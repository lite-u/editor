import { BoundingRect, Point } from '~/type';
import { ResizeDirectionName } from '~/services/selection/type';
export declare const getBoundingRectFromBoundingRects: (list: BoundingRect[]) => BoundingRect;
export declare const getAnchorByResizeDirection: (r: BoundingRect, d: ResizeDirectionName) => Point;
