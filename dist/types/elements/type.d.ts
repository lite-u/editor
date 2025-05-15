import ElementRectangle, { RectangleProps } from './rectangle/rectangle';
import ElementEllipse, { EllipseProps } from './ellipse/ellipse';
import ElementImage, { ImageProps } from './image/image';
import ElementText, { TextProps } from '~/elements/text/text';
import LineSegment, { LineSegmentProps } from '~/elements/lines/lineSegment';
import { UID } from '~/type';
export type ElementTypeMap = {
    'rectangle': ElementRectangle;
    'ellipse': ElementEllipse;
};
export type ElementPropsMap = {
    'rectangle': RectangleProps;
    'ellipse': EllipseProps;
};
export type ElementProps = RectangleProps | EllipseProps | TextProps | ImageProps | LineSegmentProps;
export type PropsWithoutIdentifiers<T extends keyof ElementPropsMap> = Omit<ElementPropsMap[T], 'id' & 'layer'>;
export type ElementNames = keyof ElementTypeMap;
export type ElementInstance = InstanceType<ElementRectangle> | InstanceType<ElementEllipse> | InstanceType<ElementImage> | InstanceType<ElementText> | InstanceType<LineSegment>;
export type ElementMap = Map<UID, ElementInstance>;
