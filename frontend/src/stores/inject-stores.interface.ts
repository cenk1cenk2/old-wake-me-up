import { ClientStore } from '../client/ClientStore'
import { WebSocketStore } from '../message/WebSocketStore'
import { UserStore } from './user.store'
import { AuthStore } from '@stores/auth.store'
import { SnackManager } from '@stores/snack-manager.store'

export interface StoreMapping {
  [AvailableStores.AUTH_STORE]: AuthStore
  userStore: UserStore
  [AvailableStores.SNACK_MANAGER]: SnackManager
  clientStore: ClientStore
  wsStore: WebSocketStore
}

export enum AvailableStores {
  AUTH_STORE = 'AuthStore',
  SNACK_MANAGER = 'SnackManager',
  USER_STORE = 'UserStore'
}

export type AllStores = Extract<keyof StoreMapping, string>
export type Stores<T extends AllStores> = Pick<StoreMapping, T>
