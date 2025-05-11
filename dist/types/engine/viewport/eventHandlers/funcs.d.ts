import Editor from '../../editor';
import { ResizeDirection } from '../../../services/selection/type';
import { Point } from '~/type';
export declare function detectHoveredModule(this: Editor): import("../../../services/selection/type").OperationHandlers | undefined;
export declare function applyResize(this: Editor, altKey: boolean, shiftKey: boolean): any;
export declare function getRotateAngle(centerPoint: Point, mousePoint: Point): number;
export declare function getResizeCursor(point: Point, centerPoint: Point): ResizeDirection;
