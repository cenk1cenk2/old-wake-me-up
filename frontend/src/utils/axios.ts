import { GeneralConstants } from '@interfaces/constants'
import axios from 'axios'

import { SnackReporter } from '../snack/SnackManager'
import { CurrentUser } from '../stores/user.store'

export function initAxios (currentUser: CurrentUser, snack: SnackReporter): void {
  axios.interceptors.request.use((config) => {
    config.headers[GeneralConstants.AUTHENTICATION_HEADER] = currentUser.token()
    return config
  })

  axios.interceptors.response.use(undefined, (error) => {
    if (!error.response) {
      snack('Backend server is not reachable, try refreshing the page.')
      return Promise.reject(error)
    }

    const status = error.response.status

    if (status === 401) {
      currentUser.tryAuthenticate().then(() => snack('Could not complete request.'))
    }

    if (status === 400 || status === 403 || status === 500) {
      snack(error.response.data.error + ': ' + error.response.data.errorDescription)
    }

    return Promise.reject(error)
  })
}
