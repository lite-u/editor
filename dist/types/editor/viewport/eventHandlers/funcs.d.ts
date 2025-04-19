import Editor from '../../editor.ts';
import { ResizeDirection } from '../../selection/type';
export declare function detectHoveredModule(this: Editor): any;
export declare function applyResize(this: Editor, altKey: boolean, shiftKey: boolean): any;
export declare function getRotateAngle(centerPoint: Point, mousePoint: Point): number;
export declare function getResizeCursor(point: Point, centerPoint: Point): ResizeDirection;
