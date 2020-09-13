import { ITheme } from '@interfaces/theme.interface'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends ITheme {}
}