import ElementRectangle from '~/elements/rectangle/rectangle'
import ElementEllipse from '~/elements/ellipse/ellipse'

export type UID = string
// export type HexColor = string
export type ElementFillColor = HexColor
export // type Opacity = IntRange<1, 101>
export type Opacity = number
export type Rotation = number
export type Shadow = boolean
export type Gradient = string

export type {ElementRectangle, ElementEllipse}