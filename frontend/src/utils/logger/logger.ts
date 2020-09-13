import * as config from 'configuration'
import winston, { format } from 'winston'

import { BrowserConsole } from '@utils/logger/logger-transport'
import { LoggerConstants, LogLevels } from '@utils/logger/logger.constants'
import { ILogger, LoggerFormat } from '@utils/logger/logger.interface'

export class Logger {
  static readonly levels = {
    [LogLevels.silent]: 0,
    [LogLevels.error]: 1,
    [LogLevels.warn]: 2,
    [LogLevels.info]: 3,
    [LogLevels.debug]: 4
  }

  public log: ILogger
  public id?: string
  public loglevel: LogLevels
  public logcolor: boolean

  constructor (module?: string) {
    this.id = module
    this.loglevel = config.get('loglevel') as LogLevels
    this.log = this.getInstance()
  }

  public getInstance (): ILogger {
    if (this.id ? !winston.loggers.has(this.id) : !winston.loggers.has(LoggerConstants.DEFAULT_LOGGER)) {
      this.initiateLogger()
    }

    if (this.id) {
      return winston.loggers.get(this.id) as ILogger
    } else {
      return winston.loggers.get(LoggerConstants.DEFAULT_LOGGER) as ILogger
    }
  }

  private initiateLogger (): void {
    const logFormat = format.printf(({ level, message, custom }: LoggerFormat) => {
      // parse multi line messages
      try {
        let multiLineMessage = message.split('\n')
        multiLineMessage = multiLineMessage.map((msg) => {
          if (msg.trim() !== '') {
            // format messages
            return this.logColoring({
              level,
              message: msg,
              custom
            })
          }
        })
        // join back multi line messages
        message = multiLineMessage.join('\n')
        // eslint-disable-next-line no-empty
      } catch {}
      return message
    })

    winston.loggers.add(this.id ?? LoggerConstants.DEFAULT_LOGGER, {
      levels: Logger.levels,
      format: format.combine(format.splat(), format.json({ space: 2 }), format.prettyPrint(), logFormat),
      transports: [
        new BrowserConsole({
          level: this.loglevel || LogLevels.debug,
          silent: this.loglevel === LogLevels.silent
        })
      ]
    })
  }

  private logColoring ({ message, custom }: LoggerFormat): string {
    let context: string

    // parse context from custom or module
    if (custom) {
      context = custom
    } else if (this.id) {
      context = this.id
    }

    return `${context ? `[${context.toUpperCase()}] ` : ''}${message}`
  }
}
