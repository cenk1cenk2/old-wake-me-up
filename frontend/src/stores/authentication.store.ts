import { GeneralConstants } from '@interfaces/constants'
import { IUser } from '@interfaces/interface'
import axios, { AxiosResponse } from 'axios'
import { detect } from 'detect-browser'
import { Base64 } from 'js-base64'
import { observable } from 'mobx'

import * as config from '../configuration'
import { SnackReporter } from '../snack/SnackManager'

export class AuthStore {
  @observable
  public loggedIn = false
  @observable
  public authenticating = false
  @observable
  public user: IUser = {
    name: 'unknown',
    admin: false,
    id: -1
  }
  @observable
  public connectionErrorMessage: string | null = null
  private tokenCache: string | null = null
  private reconnectTimeoutId: number | null = null
  private reconnectTime = 7500

  public constructor (private readonly snack: SnackReporter) {}

  public token (): string | null {
    if (this.tokenCache !== null) {
      return this.tokenCache
    }

    const localStorageToken = window.localStorage.getItem(GeneralConstants.TOKEN_NAME)
    if (localStorageToken) {
      this.tokenCache = localStorageToken
      return localStorageToken
    }
  }

  public async login (username: string, password: string): Promise<void> {
    this.loggedIn = false
    this.authenticating = true

    const browser = detect()
    const name = browser && browser.name + ' ' + browser.version || 'unknown browser'

    try {
      const response = await axios.create().request({
        url: config.get('url') + 'client',
        method: 'POST',
        data: { name },
        headers: { Authorization: 'Basic ' + Base64.encode(username + ':' + password) }
      })

      this.snack(`A client named '${name}' was created for your session.`)
      this.setToken(response.data.token)

      try {
        await this.tryAuthenticate()
        this.authenticating = false
        this.loggedIn = true
      } catch {
        this.authenticating = false
        console.log('create client succeeded, but authenticated with given token failed')
      }
    } catch (e) {
      this.authenticating = false
      return this.snack('Login failed')
    }
  }

  public async tryAuthenticate (): Promise<AxiosResponse<IUser>> {
    if (!this.token()) {
      return Promise.reject()
    }

    try {
      const response = await axios.create().get(config.get('url') + 'current/user', { headers: { [GeneralConstants.AUTHENTICATION_HEADER]: this.token() } })

      this.user = response.data
      this.loggedIn = true
      this.connectionErrorMessage = null
      this.reconnectTime = 7500

      return response
    } catch (e) {
      if (!e || !e.response) {
        this.connectionError('No network connection or server unavailable.')
        throw new Error(e)
      }

      if (e.response.status >= 500) {
        this.connectionError(`${e.response.statusText} (code: ${e.response.status}).`)
        throw new Error(e)
      }

      this.connectionErrorMessage = null

      if (e.response.status >= 400 && e.response.status < 500) {
        this.logout()
      }

      throw new Error(e)
    }
  }

  public async logout (): Promise<void> {
    try {
      const response = await axios.get(config.get('url') + 'client')

      response.data
        .filter((client) => client.token === this.tokenCache)
        .forEach((client) => {
          return axios.delete(config.get('url') + 'client/' + client.id)
        })
    } finally {
      window.localStorage.removeItem(GeneralConstants.TOKEN_NAME)
      this.tokenCache = null
      this.loggedIn = false
    }
  }

  public changePassword (pass: string): void {
    axios.post(config.get('url') + 'current/user/password', { pass }).then(() => this.snack('Password changed'))
  }

  public tryReconnect (quiet = false): void {
    this.tryAuthenticate().catch(() => {
      if (!quiet) {
        this.snack('Reconnect failed')
      }
    })
  }

  private setToken (token: string): void {
    this.tokenCache = token
    window.localStorage.setItem(GeneralConstants.TOKEN_NAME, token)
  }

  private connectionError (message: string): void {
    this.connectionErrorMessage = message
    if (this.reconnectTimeoutId !== null) {
      window.clearTimeout(this.reconnectTimeoutId)
    }
    this.reconnectTimeoutId = window.setTimeout(() => this.tryReconnect(true), this.reconnectTime)
    this.reconnectTime = Math.min(this.reconnectTime * 2, 120000)
  }
}
