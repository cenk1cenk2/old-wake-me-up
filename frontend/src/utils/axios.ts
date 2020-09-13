import { GeneralConstants } from '@interfaces/constants'
import axios from 'axios'

import { AuthStore } from '@stores/auth.store'
import { SnackReporter, SnackManager } from '@stores/snack-manager.store'

export function initAxios (authStore: AuthStore, snack: SnackManager): void {
  axios.interceptors.request.use((config) => {
    config.headers[GeneralConstants.AUTHENTICATION_HEADER] = authStore.token()
    return config
  })

  axios.interceptors.response.use(undefined, (error) => {
    if (!error.response) {
      snack.show('Backend server is not reachable, try refreshing the page.')
      return Promise.reject(error)
    }

    const status = error.response.status

    if (status === 401) {
      authStore.tryAuthenticate().then(() => snack.show('Could not complete request.'))
    }

    if (status === 400 || status === 403 || status === 500) {
      snack.show(error.response.data.error + ': ' + error.response.data.errorDescription)
    }

    return Promise.reject(error)
  })
}
