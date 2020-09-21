import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { DefaultTheme } from 'styled-components'

import { StateUtilsType } from '@utils/state.utils'

export interface TemplateProps {
  header?: {
    transperent?: boolean
  }
  narrow?: boolean
  navigation?: {
    collapsable?: boolean
    type: NavigationTypes
  }
  items?: NavigationItems[]
  theme?: DefaultTheme
}

export interface State extends Partial<StateUtilsType<State, Action>> {
  narrow?: TemplateProps['narrow']
  header?: TemplateProps['header']
  navigation?: {
    type?: NavigationTypes
    state?: NavigationStates
    mouse?: boolean
  }
}

export interface NavigationItems {
  icon?: IconDefinition
  name?: string
  url?: string
}

export enum NavigationStates {
  open = 'open',
  overlay = 'overlay',
  close = 'close',
  collapse = 'collapse'
}

export enum NavigationTypes {
  header = 'header',
  menu = 'menu',
  off = 'off'
}

export interface Action {
  type: ActionTypes
  payload?: any
}

export enum ActionTypes {
  'navigation:toggle',
  'navigation:open',
  'navigation:close',
  'navigation:mouseEnter',
  'navigation:mouseLeave'
}
