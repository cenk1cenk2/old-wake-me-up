import { AppStore } from '../application/AppStore'
import { ClientStore } from '../client/ClientStore'
import { MessagesStore } from '../message/MessagesStore'
import { WebSocketStore } from '../message/WebSocketStore'
import { PluginStore } from '../plugin/PluginStore'
import { SnackManager } from '../snack/SnackManager'
import { AuthStore } from './authentication.store'
import { UserStore } from './user.store'

export interface StoreMapping {
  [AvailableStores.AUTH_STORE]: AuthStore
  userStore: UserStore
  snackManager: SnackManager
  messagesStore: MessagesStore
  clientStore: ClientStore
  appStore: AppStore
  pluginStore: PluginStore
  wsStore: WebSocketStore
}

export enum AvailableStores {
  AUTH_STORE = 'AuthStore',
  USER_STORE = 'UserStore',
}

export type AllStores = Extract<keyof StoreMapping, string>
export type Stores<T extends AllStores> = Pick<StoreMapping, T>
