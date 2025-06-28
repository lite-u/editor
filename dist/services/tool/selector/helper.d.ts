import { ResizeDirection } from '../../selection/type';
import { Point } from '~/type';
export declare function getRotateAngle(centerPoint: Point, mousePoint: Point): number;
export declare function getResizeCursor(point: Point, centerPoint: Point): ResizeDirection;
