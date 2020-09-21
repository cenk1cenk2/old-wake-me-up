import { createMuiTheme, ThemeProvider, Theme, WithStyles, withStyles, StylesProvider } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import axios, { AxiosResponse } from 'axios'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import { AvailableStores } from 'stores/inject-stores.interface'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

import Clients from '@root/client/Clients'
import { ConnectionErrorBanner } from '@root/components/connection-error-banner.component'
import LoadingSpinner from '@root/components/loading-spinner.component'
import ScrollUpButton from '@root/components/scroll-up-button.component'
import SettingsDialog from '@root/components/settings-dialog.component'
import * as config from '@root/configuration'
import { IVersion } from '@root/interfaces/interface'
import { ThemeConstants, ThemeTypes } from '@root/interfaces/theme.constants'
import { ITheme } from '@root/interfaces/theme.interface'
import Header from '@root/layout2/components/header'
import Navigation from '@root/layout2/components/navigation'
import SnackBarHandler from '@root/notifications/snack-bar.handler'
import Login from '@root/pages/login'
import { inject } from '@root/stores/inject-stores'
import { Stores } from '@root/stores/inject-stores.interface'
import Users from '@root/user/users'
import { DarkTheme } from '@themes/dark.theme'
import { GlobalStyles } from '@themes/global.theme'

const themeMap: Record<ThemeTypes, ITheme> = {
  [ThemeTypes.DARK]: DarkTheme
}

const isThemeKey = (value: string | null): value is ThemeTypes => {
  return Object.values(ThemeTypes).includes(value as any)
}

@observer
class Layout extends React.Component<Stores<AvailableStores.AUTH_STORE>> {
  private static defaultVersion = ''

  @observable
  private currentTheme: ThemeTypes = ThemeTypes.DARK
  @observable
  private showSettings = false
  @observable
  private version = Layout.defaultVersion
  @observable
  private navOpen = false

  public componentDidMount () {
    if (this.version === Layout.defaultVersion) {
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

  public render () {
    const { version, showSettings, currentTheme } = this
    const { [AvailableStores.AUTH_STORE]: { loggedIn,
      authenticating,
      user: { name, admin },
      logout,
      tryReconnect,
      connectionErrorMessage } } = this.props
    const theme = themeMap[currentTheme]
    const loginRoute = () => (loggedIn ? <Redirect to="/" /> : <Login />)

    return (
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <StyledThemeProvider theme={theme}>
            <HashRouter>
              <div>
                {!connectionErrorMessage ? null : <ConnectionErrorBanner height={64} retry={() => tryReconnect()} message={connectionErrorMessage} />}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <CssBaseline />
                  <GlobalStyles />
                  <Header
                    style={{ top: !connectionErrorMessage ? 0 : 64 }}
                    admin={admin}
                    name={name}
                    version={version}
                    loggedIn={loggedIn}
                    showSettings={() => (this.showSettings = true)}
                    logout={() => this.props[AvailableStores.AUTH_STORE].logout()}
                    // setNavOpen={this.setNavOpen.bind(this)}
                  />
                  <div style={{ display: 'flex' }}>
                    {/* <Navigation loggedIn={loggedIn} navOpen={this.navOpen} setNavOpen={this.setNavOpen.bind(this)} /> */}
                    <main>
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
                    </main>
                  </div>
                  {showSettings && <SettingsDialog fClose={() => (this.showSettings = false)} />}
                  <ScrollUpButton />
                  <SnackBarHandler />
                </div>
              </div>
            </HashRouter>
          </StyledThemeProvider>
        </ThemeProvider>
      </StylesProvider>
    )
  }

  // private toggleTheme () {
  //   this.currentTheme = this.currentTheme === ThemeTypes.DARK ? ThemeTypes.LIGHT : ThemeTypes.DARK
  //   localStorage.setItem(ThemeConstants.LOCAL_STORAGE_KEY, this.currentTheme)
  // }

  // private setNavOpen (open: boolean) {
  //   this.navOpen = open
  // }
}

export default inject(AvailableStores.AUTH_STORE)(Layout)
