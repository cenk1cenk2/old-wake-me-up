import { IMessage } from '@interfaces/interface'
import Notify from 'notifyjs'
import removeMarkdown from 'remove-markdown'

import { Logger } from '@utils/logger'

export function mayAllowPermission (): boolean {
  return Notify.needsPermission && Notify.isSupported() && Notification.permission !== 'denied'
}

export function requestPermission (): void {
  const logger = new Logger('browser-notification').log
  if (Notify.needsPermission && Notify.isSupported()) {
    Notify.requestPermission(
      () => logger.info('Granted browser notification permissions.'),
      () => logger.warn('Browser notification permission denied.')
    )
  }
}

export function notifyNewMessage (msg: IMessage): void {
  const notify = new Notify(msg.title, {
    body: removeMarkdown(msg.message),
    icon: msg.image,
    silent: true,
    notifyClick: closeAndFocus,
    notifyShow: closeAfterTimeout
  })

  notify.show()
}

function closeAndFocus (event: Event): void {
  if (window.parent) {
    window.parent.focus()
  }
  window.focus()
  window.location.href = '/'
  const target = event.target as Notification
  target.close()
}

function closeAfterTimeout (event: Event): void {
  setTimeout(() => {
    const target = event.target as Notification
    target.close()
  }, 5000)
}
