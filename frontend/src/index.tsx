import * as React from 'react'
import * as ReactDOM from 'react-dom'

import 'typeface-roboto'
import { initiateConfig } from './configuration'
import registerServiceWorker from './service-worker'
import Layout from '@root/layout'
import { initStores } from '@stores/init-stores'
import { InjectProvider } from '@stores/inject-stores'
import { AvailableStores } from '@stores/inject-stores.interface'
import { registerReactions } from '@stores/reactions'
import PageLoader from '@themes/page-loader'
import { initAxios } from '@utils/axios'
import { Logger } from '@utils/logger'

function bootstrap (): void {
  initiateConfig()

  const logger = new Logger('bootstrap').log

  const stores = initStores()

  initAxios(stores[AvailableStores.AUTH_STORE], stores[AvailableStores.SNACK_MANAGER])

  registerReactions(stores)

  stores[AvailableStores.AUTH_STORE].tryAuthenticate().catch((e) => {
    logger.debug('Initial authentication try failed.', e)
  })

  window.onbeforeunload = () => {
    stores.wsStore.close()
    logger.debug('Closed web socket connection to backend.')
  }

  ReactDOM.render(
    <InjectProvider stores={stores}>
      <Layout />
    </InjectProvider>,
    document.getElementById('root')
  )

  registerServiceWorker()
}

bootstrap()
