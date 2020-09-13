import { LeveledLogMethod, Logger as Winston } from 'winston'

import { LogLevels } from '@utils/logger/logger.constants'

export interface LoggerFormat {
  level: string
  message: string
  custom?: string
}

export type ILogger = Winston & Record<keyof typeof LogLevels, LeveledLogMethod>
