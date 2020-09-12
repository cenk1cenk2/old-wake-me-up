import * as React from 'react'
import * as ReactDOM from 'react-dom'

import 'typeface-roboto'

import { AppStore } from './application/AppStore'
import { ClientStore } from './client/ClientStore'
import * as config from './config'
import Layout from './layout/Layout'
import { MessagesStore } from './message/MessagesStore'
import { WebSocketStore } from './message/WebSocketStore'
import { PluginStore } from './plugin/PluginStore'
import registerServiceWorker from './service-worker'
import { SnackManager } from './snack/SnackManager'
import { AuthStore } from './stores/authentication.store'
import { InjectProvider } from './stores/inject-stores'
import { AvailableStores, StoreMapping } from './stores/inject-stores.interface'
import { registerReactions } from './stores/reactions'
import { UserStore } from './stores/user.store'
import { initAxios } from '@utils/axios'

const defaultDevConfig = {
  url: 'http://192.168.10.7:4200/'
}

const { port, hostname, protocol, pathname } = window.location
const slashes = protocol.concat('//')
const path = pathname.endsWith('/') ? pathname : pathname.substring(0, pathname.lastIndexOf('/'))
const url = slashes.concat(port ? hostname.concat(':', port) : hostname) + path
const urlWithSlash = url.endsWith('/') ? url : url.concat('/')

const defaultProdConfig = {
  url: urlWithSlash
}

declare global {
  interface Window {
    config: config.IConfig
  }
}

const initStores = (): StoreMapping => {
  const snackManager = new SnackManager()
  const appStore = new AppStore(snackManager.snack)
  const userStore = new UserStore(snackManager.snack)
  const messagesStore = new MessagesStore(appStore, snackManager.snack)
  const authStore = new AuthStore(snackManager.snack)
  const clientStore = new ClientStore(snackManager.snack)
  const wsStore = new WebSocketStore(snackManager.snack, authStore)
  const pluginStore = new PluginStore(snackManager.snack)
  appStore.onDelete = () => messagesStore.clearAll()

  return {
    appStore,
    snackManager,
    userStore,
    messagesStore,
    [AvailableStores.AUTH_STORE]: authStore,
    clientStore,
    wsStore,
    pluginStore
  }
}

;(function clientJS () {
  if (process.env.NODE_ENV === 'production') {
    config.set(window.config || defaultProdConfig)
  } else {
    config.set(window.config || defaultDevConfig)
  }
  const stores = initStores()
  initAxios(stores[AvailableStores.AUTH_STORE], stores.snackManager.snack)

  registerReactions(stores)

  try {
    stores[AvailableStores.AUTH_STORE].tryAuthenticate()
    // eslint-disable-next-line no-empty
  } catch {}

  window.onbeforeunload = () => {
    stores.wsStore.close()
  }

  ReactDOM.render(
    <InjectProvider stores={stores}>
      <Layout />
    </InjectProvider>,
    document.getElementById('root')
  )
  registerServiceWorker()
})()
