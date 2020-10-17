import { CastEvent } from '@interfaces/event.interface'
import { StylesProvider, ThemeProvider } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import axios, { AxiosResponse } from 'axios'
import clsx from 'clsx'
import { debounce } from 'lodash'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component, createContext, Fragment } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { AvailableStores } from 'stores/inject-stores.interface'
import styled, { css, ThemeProvider as StyledThemeProvider, withTheme } from 'styled-components'

import { animations as DrawerAnimations, DrawerNavigation } from './drawer-navigation'
import { Header } from './header'
import { Action, ActionTypes, NavigationStates, NavigationTypes, State, TemplateProps } from './index.interface'
import Clients from '@root/client/Clients'
import { ConnectionErrorBanner } from '@root/components/connection-error-banner.component'
import LoadingSpinner from '@root/components/loading-spinner.component'
import ScrollUpButton from '@root/components/scroll-up-button.component'
import SettingsDialog from '@root/components/settings-dialog.component'
import * as config from '@root/configuration'
import { IVersion } from '@root/interfaces/interface'
import { ThemeConstants, ThemeTypes } from '@root/interfaces/theme.constants'
import { ITheme } from '@root/interfaces/theme.interface'
import SnackBarHandler from '@root/notifications/snack-bar.handler'
import Login from '@root/pages/login'
import { inject } from '@root/stores/inject-stores'
import { Stores } from '@root/stores/inject-stores.interface'
import Users from '@root/user/users'
import { DarkTheme } from '@themes/dark.theme'
import { GlobalStyles } from '@themes/global.theme'
import { StateUtils } from '@utils/state.utils'

export const Context = createContext<Partial<State>>({})
export const { Consumer, Provider } = Context

const themeMap: Record<ThemeTypes, ITheme> = {
  [ThemeTypes.DARK]: DarkTheme
}

const isThemeKey = (value: string | null): value is ThemeTypes => {
  return Object.values(ThemeTypes).includes(value as any)
}

@observer
class Template extends Component<TemplateProps & Stores<AvailableStores.AUTH_STORE>, Partial<State>> {
  static defaultProps: TemplateProps = {
    header: {
      transperent: true
    },
    narrow: true,
    navigation: {
      type: NavigationTypes.header,
      collapsable: true
    },
    items: []
  }

  private static defaultVersion = ''

  @observable
  private currentTheme: ThemeTypes = ThemeTypes.DARK
  @observable
  private showSettings = false
  @observable
  private version = Template.defaultVersion

  public state: Partial<State> = {
    narrow: false,
    navigation: {
      type: NavigationTypes.off
    },
    ...StateUtils.bind(this)()
  }

  private theme: ITheme

  private watchResize = debounce(this.handleResize.bind(this), 100, { leading: true })

  public reducer (state: Partial<State>, action: Action) {
    if (action.type === ActionTypes['navigation:close']) {
      // navigation close action
      state = { navigation: { state: NavigationStates.close } }
    } else if (action.type === ActionTypes['navigation:open']) {
      // set state
      state = { navigation: { state: NavigationStates.open } }
    } else if (action.type === ActionTypes['navigation:toggle']) {
      if ([ NavigationStates.overlay, NavigationStates.open, NavigationStates.collapse ].includes(this.state.navigation.state)) {
        state = { navigation: { state: NavigationStates.close } }
      } else {
        state = { navigation: { state: NavigationStates.open } }
      }
    } else if (action.type === ActionTypes['navigation:mouseEnter']) {
      state = { navigation: { state: NavigationStates.open, mouse: true } }
    } else if (action.type === ActionTypes['navigation:mouseLeave']) {
      state = { navigation: { mouse: false } }
    }

    return state
  }

  public componentDidMount () {
    // set easier logical operations
    this.state.write({
      navigation: { type: this.props.navigation.type },
      narrow: this.props.narrow,
      header: this.props.header
    })
    this.state.write({ narrow: this.props.narrow })

    // set cross modes
    if (this.props.navigation.type === NavigationTypes.menu) {
      this.state.write({ narrow: false, header: { transperent: false } })
    }

    // add global listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.watchResize)
    }

    // set initial state for the render
    this.handleResize({ target: window })

    if (this.version === Template.defaultVersion) {
      axios.get(config.get('url') + 'version').then((resp: AxiosResponse<IVersion>) => {
        this.version = resp.data.version
      })
    }

    const localStorageTheme = window.localStorage.getItem(ThemeConstants.LOCAL_STORAGE_KEY)
    if (isThemeKey(localStorageTheme)) {
      this.currentTheme = localStorageTheme
    } else {
      window.localStorage.setItem(ThemeConstants.LOCAL_STORAGE_KEY, this.currentTheme)
    }
  }

  public componentWillUnmount () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.watchResize)
    }
  }

  public componentDidUpdate () {
    // check if window is collapsable or large enought to show the navigation bar
    if (this.state.navigation.state === NavigationStates.open) {
      let navigation: NavigationStates
      // decide on state, css makes it laggy
      if (this.props.navigation.collapsable && !this.state.navigation.mouse) {
        navigation = window.innerWidth > this.theme.breakpoints.values.md ? NavigationStates.collapse : NavigationStates.overlay
      } else {
        navigation = window.innerWidth > this.theme.breakpoints.values.md ? NavigationStates.open : NavigationStates.overlay
      }

      // set state
      if (this.state.navigation.state !== navigation) {
        this.state.write({ navigation: { state: navigation } })
      }
    }
  }

  public render () {
    const { version, showSettings, currentTheme } = this
    const { [AvailableStores.AUTH_STORE]: { loggedIn,
      authenticating,
      user: { name, admin },
      logout,
      tryReconnect,
      connectionErrorMessage } } = this.props
    this.theme = themeMap[currentTheme]
    const loginRoute = () => (loggedIn ? <Redirect to="/" /> : <Login />)

    return (
      <StylesProvider injectFirst>
        <ThemeProvider theme={this.theme}>
          <StyledThemeProvider theme={this.theme}>
            <BrowserRouter>
              <CssBaseline />
              <GlobalStyles />
              <div>
                {!connectionErrorMessage ? null : <ConnectionErrorBanner height={64} retry={() => tryReconnect()} message={connectionErrorMessage} />}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <CssBaseline />
                  <Provider value={this.state}>
                    <Header
                      transperent={this.state.header?.transperent}
                      narrow={this.state.narrow}
                      project={{
                        name: 'asd',
                        version: 'asd',
                        author: 'asd'
                      }}
                      items={this.props.items}
                    />
                    <DrawerNavigation collapsable={this.props.navigation.collapsable} items={this.props.items} />
                    <Main className={clsx(this.state.navigation.state, { narrow: this.state.narrow })}>
                      <Switch>
                        {authenticating ? (
                          <Route path="/">
                            <LoadingSpinner />
                          </Route>
                        ) : null}
                        <Route exact path="/login" render={loginRoute} />
                        {loggedIn ? null : <Redirect to="/login" />}
                        <Route exact path="/" component={Users} />
                        <Route exact path="/clients" component={Clients} />
                        <Route exact path="/users" component={Users} />
                      </Switch>
                    </Main>
                  </Provider>
                  {showSettings && <SettingsDialog fClose={() => (this.showSettings = false)} />}
                  <ScrollUpButton />
                  <SnackBarHandler />
                </div>
              </div>
            </BrowserRouter>
          </StyledThemeProvider>
        </ThemeProvider>
      </StylesProvider>
    )
  }

  private async handleResize (e: Partial<Event>) {
    const event = e as CastEvent<Window>
    if (event.target.innerWidth < this.theme.breakpoints.values.md) {
      // set navigation type to menu type for smaller screens
      this.state.write({ navigation: { type: NavigationTypes.menu } })

      // when screen gets resized to small collapse the navigation
      this.state.dispatch({ type: ActionTypes['navigation:close'] })
    } else {
      // set navigation type to prop type when resized to a larger screen
      if (this.state.navigation.type !== this.props.navigation.type) {
        await this.state.write({ navigation: { type: this.props.navigation.type } })
      }

      // if intended type is menu, open it, else close it
      if (this.state.navigation.type === NavigationTypes.menu) {
        // when screen gets resized back expand the navigation
        this.state.dispatch({ type: ActionTypes['navigation:open'] })
      } else {
        this.state.dispatch({ type: ActionTypes['navigation:close'] })
      }
    }
  }

  // private toggleTheme () {
  //   this.currentTheme = this.currentTheme === ThemeTypes.DARK ? ThemeTypes.LIGHT : ThemeTypes.DARK
  //   localStorage.setItem(ThemeConstants.LOCAL_STORAGE_KEY, this.currentTheme)
  // }

  // private setNavOpen (open: boolean) {
  //   this.navOpen = open
  // }
}

export default inject(AvailableStores.AUTH_STORE)(Template)

const Main = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: ${theme.template.header.headerSizeMin};
    padding-top: calc(${theme.template.header.headerSizeMin} * 0.1);
    ${DrawerAnimations('collapse', 'left')}

    &.open {
      left: ${theme.template.navigation.width};
    }

    &.collapse {
      left: ${theme.template.navigation.collapseWidth};
    }

    &.close {
      left: 0;
    }

    padding: ${theme.spacing(1)}px;

    ${theme.breakpoints.up('lg')} {
      &.narrow {
        padding-left: calc((100% - ${theme.breakpoints.values.lg}px) / 2);
        padding-right: calc((100% - ${theme.breakpoints.values.lg}px) / 2);
      }
    }
  `
)
