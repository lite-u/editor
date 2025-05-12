import { ResizeDirection } from '../../selection/type';
import { Point } from '~/type';
import ToolManager from '~/services/tools/toolManager';
export declare function detectHoveredModule(this: ToolManager): import("../../selection/type").OperationHandlers | undefined;
export declare function applyResize(this: ToolManager, altKey: boolean, shiftKey: boolean): any;
export declare function getRotateAngle(centerPoint: Point, mousePoint: Point): number;
export declare function getResizeCursor(point: Point, centerPoint: Point): ResizeDirection;
