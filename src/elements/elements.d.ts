import ElementRectangle, {RectangleProps} from './rectangle/rectangle'
import ElementEllipse, {EllipseProps} from './ellipse/ellipse'
import ElementImage, {ImageProps} from './image/image'
import ElementText from '~/elements/text/text'

export type ModuleTypeMap = {
  'rectangle': ElementRectangle
  'ellipse': ElementEllipse
}
export type ElementPropsMap = {
  'rectangle': RectangleProps
  'ellipse': EllipseProps
}
export type ElementProps = RectangleProps | EllipseProps | TextProps | ImageProps
// type ElementPropsType<T extends keyof ElementPropsMap> = ElementPropsMap[T]
export type PropsWithoutIdentifiers<T extends keyof ElementPropsMap> = Omit<ElementPropsMap[T], 'id' & 'layer'>
export type ModuleNames = keyof ModuleTypeMap
export type ElementInstance =
  InstanceType<ElementRectangle>
  | InstanceType<ElementEllipse>
  | InstanceType<ElementImage>
  | InstanceType<ElementText>
export type ElementMap = Map<UID, ElementInstance>

export {}
