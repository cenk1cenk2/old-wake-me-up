import { AppStore } from '../application/AppStore'
import { ClientStore } from '../client/ClientStore'
import { MessagesStore } from '../message/MessagesStore'
import { WebSocketStore } from '../message/WebSocketStore'
import { PluginStore } from '../plugin/PluginStore'
import { SnackManager } from '../snack/SnackManager'
import { UserStore } from '../user/UserStore'
import { CurrentUser } from './user.store'

export interface StoreMapping {
  userStore: UserStore
  snackManager: SnackManager
  messagesStore: MessagesStore
  currentUser: CurrentUser
  clientStore: ClientStore
  appStore: AppStore
  pluginStore: PluginStore
  wsStore: WebSocketStore
}
