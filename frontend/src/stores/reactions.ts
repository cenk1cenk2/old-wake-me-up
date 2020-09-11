import { reaction } from 'mobx'

import * as Notifications from '../snack/browserNotification'
import { StoreMapping } from './inject-stores.interface'

export function registerReactions (stores: StoreMapping): void {
  const clearAll = (): void => {
    stores.messagesStore.clearAll()
    stores.appStore.clear()
    stores.clientStore.clear()
    stores.userStore.clear()
    stores.wsStore.close()
  }

  const loadAll = (): void => {
    stores.wsStore.listen((message) => {
      stores.messagesStore.publishSingleMessage(message)
      Notifications.notifyNewMessage(message)

      if (message.priority >= 4) {
        const src = 'static/notification.ogg'
        const audio = new Audio(src)
        audio.play()
      }
    })

    stores.appStore.refresh()
  }

  reaction(
    () => stores.currentUser.loggedIn,
    (loggedIn) => {
      if (loggedIn) {
        loadAll()
      } else {
        clearAll()
      }
    }
  )

  reaction(
    () => stores.currentUser.connectionErrorMessage,
    (connectionErrorMessage) => {
      if (!connectionErrorMessage) {
        clearAll()
        loadAll()
      }
    }
  )
}
