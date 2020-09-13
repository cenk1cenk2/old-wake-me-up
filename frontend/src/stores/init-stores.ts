import { ClientStore } from '../client/ClientStore'
import { WebSocketStore } from '../message/WebSocketStore'
import { AvailableStores, StoreMapping } from '../stores/inject-stores.interface'
import { UserStore } from '../stores/user.store'
import { AuthStore } from '@stores/auth.store'
import { SnackManager } from '@stores/snack-manager.store'

export function initStores (): StoreMapping {
  const snackManager = new SnackManager()

  const authStore = new AuthStore(snackManager)
  const userStore = new UserStore(snackManager.show)
  const clientStore = new ClientStore(snackManager.show)
  const wsStore = new WebSocketStore(snackManager.show, authStore)

  return {
    [AvailableStores.SNACK_MANAGER]: snackManager,
    userStore,
    [AvailableStores.AUTH_STORE]: authStore,
    clientStore,
    wsStore
  }
}
