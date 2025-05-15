import { ResizeDirectionName } from '~/services/selection/type';
import { RequiredRectangleProps } from '~/elements/rectangle/rectangle';
import { Rect } from '~/type';
export interface TransformProps {
    downPoint: {
        x: number;
        y: number;
    };
    movePoint: {
        x: number;
        y: number;
    };
    elementOrigin: RequiredRectangleProps;
    rotation: number;
    handleName: ResizeDirectionName;
    scale: number;
    dpr: number;
    altKey?: boolean;
    shiftKey?: boolean;
}
declare function transform({ downPoint, movePoint, elementOrigin, rotation, handleName, scale, dpr, altKey, shiftKey, }: TransformProps): Rect;
export default transform;
