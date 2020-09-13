import { LineHeightProperty, FontWeightProperty, FontSizeProperty, ColorProperty } from 'csstype'

export interface ITextConfig {
  font: Record<FontTypes, FontImports>
  typography: TypographyOptions
  settings?: Settings
}

type FontTypes = 'heading' | 'default'

interface FontImports {
  name: string
}

type TypographyNames<T extends FontTypes> =
T extends 'heading' ?
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  :
  T extends 'default' ?
    | 'p'
    | 'small'
    :
    never

interface Settings {
  heading: HeadingSettings
  default: TextSettings
  options: OptionsSettings
}

interface OptionsSettings {
  fontSize: number
}

interface HeadingSettings extends BaseSettings {
  color: ColorProperty
  smallColor: ColorProperty
}

interface TextSettings extends BaseSettings {
  color?: ColorProperty
}

interface BaseSettings {
  lineHeight: LineHeightProperty<string>
  fontWeight: FontWeightProperty
}

interface TypographyOptions {
  heading: Record<TypographyNames<'heading'>, HeadingOptions>
  default: Record<TypographyNames<'default'>, TextOptions>
}

interface HeadingOptions {
  fontSize: FontSizeProperty<string>
}

interface TextOptions {
  fontSize: FontSizeProperty<string>
}