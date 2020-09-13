import { AppStore } from '../application/AppStore'
import { ClientStore } from '../client/ClientStore'
import { MessagesStore } from '../message/MessagesStore'
import { WebSocketStore } from '../message/WebSocketStore'
import { PluginStore } from '../plugin/PluginStore'
import { SnackManager } from '../snack/SnackManager'
import { AuthStore } from '../stores/authentication.store'
import { AvailableStores, StoreMapping } from '../stores/inject-stores.interface'
import { UserStore } from '../stores/user.store'

export function initStores (): StoreMapping {
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