import { EOL } from 'os'
import { LEVEL, MESSAGE } from 'triple-beam'
import winston from 'winston'
import TransportStream from 'winston-transport'

export class BrowserConsole extends TransportStream {
  private methods = {
    debug: 'debug',
    error: 'error',
    info: 'info',
    warn: 'warn'
  }

  constructor (opts?: TransportStream.TransportStreamOptions) {
    super(opts)

    if (opts && opts.level) {
      this.level = opts.level
    }
  }

  public log (logEntry: winston.LogEntry, next: () => void): void {
    // (window as any).l = logEntry;
    setImmediate(() => {
      (this as any).emit('logged', logEntry)
    })

    const { [MESSAGE]: message, [LEVEL]: level } = logEntry
    const mappedMethod = this.methods[level]

    if (Object.getOwnPropertySymbols(logEntry).length === 2)
    // eslint-disable-next-line no-console
      console[mappedMethod](message)
    else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let args = logEntry[Object.getOwnPropertySymbols(logEntry)[1]]
      args = args.length >= 1 ? args[0] : args

      if (args?.custom) {
        delete args.custom
      }

      if (args && Object.keys(args).length > 0) {
        // eslint-disable-next-line no-console
        console[mappedMethod](message, EOL, args)
      } else {
        // eslint-disable-next-line no-console
        console[mappedMethod](message)
      }
    }

    next()
  }
}