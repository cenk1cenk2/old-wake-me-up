import { Logger } from '@utils/logger'

let config: typeof CONFIG

declare global {
  interface Window {
    config: typeof CONFIG
  }
}

export function set (c: typeof CONFIG): void {
  config = c
}

export function get<T extends keyof typeof CONFIG> (val: T): typeof CONFIG[T] {
  return config[val]
}

export function initiateConfig (): void {
  if (process.env.NODE_ENV === 'production') {
    const { port, hostname, protocol, pathname } = window.location

    const slashes = protocol.concat('//')
    const path = pathname.endsWith('/') ? pathname : pathname.substring(0, pathname.lastIndexOf('/'))
    const url = slashes.concat(port ? hostname.concat(':', port) : hostname) + path
    const urlWithSlash = url.endsWith('/') ? url : url.concat('/')

    const productionConfigOverride = {
      url: urlWithSlash
    }

    config = window.config ?? { ...CONFIG, ...productionConfigOverride }
  } else {
    config = window.config ?? CONFIG
  }

  const logger = new Logger('configuration').log
  logger.debug(`Running in ${process.env.NODE_ENV} mode.`, config)
}
