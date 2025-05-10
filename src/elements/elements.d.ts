import Rectangle, {RectangleProps} from './rectangle/rectangle'
import Ellipse, {EllipseProps} from './ellipse/ellipse'
import {ImageProps} from './image/image'

export type ModuleTypeMap = {
  'rectangle': Rectangle
  'ellipse': Ellipse
}
export type ModulePropsMap = {
  'rectangle': RectangleProps
  'ellipse': EllipseProps
}
export type ModuleProps = RectangleProps | EllipseProps | TextProps | ImageProps
// type ModulePropsType<T extends keyof ModulePropsMap> = ModulePropsMap[T]
export type PropsWithoutIdentifiers<T extends keyof ModulePropsMap> = Omit<ModulePropsMap[T], 'id' & 'layer'>
export type ModuleNames = keyof ModuleTypeMap
export type ModuleInstance = Rectangle | Ellipse
export type ModuleMap = Map<UID, ModuleInstance>

export {}
