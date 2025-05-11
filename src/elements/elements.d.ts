import ElementRectangle, {RectangleProps} from './rectangle/rectangle'
import ElementEllipse, {EllipseProps} from './ellipse/ellipse'
import ElementImage, {ImageProps} from './image/image'
import ElementText from '~/elements/text/text'

export type ModuleTypeMap = {
  'rectangle': ElementRectangle
  'ellipse': ElementEllipse
}
export type ModulePropsMap = {
  'rectangle': RectangleProps
  'ellipse': EllipseProps
}
export type ElementProps = RectangleProps | EllipseProps | TextProps | ImageProps
// type ModulePropsType<T extends keyof ModulePropsMap> = ModulePropsMap[T]
export type PropsWithoutIdentifiers<T extends keyof ModulePropsMap> = Omit<ModulePropsMap[T], 'id' & 'layer'>
export type ModuleNames = keyof ModuleTypeMap
export type ElementInstance = ElementRectangle | ElementEllipse | ElementImage | ElementText
export type ElementMap = Map<UID, ElementInstance>

export {}
