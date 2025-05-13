import { ResizeDirection } from '../../selection/type';
import { Point } from '~/type';
import ToolManager from '~/services/tool/toolManager';
export declare function detectHoveredElement(this: ToolManager): import("../../selection/type").OperationHandler | undefined;
export declare function getRotateAngle(centerPoint: Point, mousePoint: Point): number;
export declare function getResizeCursor(point: Point, centerPoint: Point): ResizeDirection;
