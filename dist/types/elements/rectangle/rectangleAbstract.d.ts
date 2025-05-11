import { ShapeCreationProps } from '../shape/shape';
export interface RectangleProps extends ShapeCreationProps {
    id: string;
    layer: number;
    width?: number;
    height?: number;
    radius?: number;
}
export type RequiredRectangleProps = Required<RectangleProps>;
export default Rectangle;
