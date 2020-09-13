import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import Close from '@material-ui/icons/Close'
import { observable, reaction } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

import { inject } from '@stores/inject-stores'
import { AvailableStores, Stores } from '@stores/inject-stores.interface'

@observer
class SnackBarHandler extends Component<Stores<AvailableStores.SNACK_MANAGER>> {
  private static MAX_VISIBLE_SNACK_TIME_IN_MS = 6000
  private static MIN_VISIBLE_SNACK_TIME_IN_MS = 1000

  @observable
  private open = false
  @observable
  private openWhen = 0

  private dispose: () => void

  public componentDidMount (): void {
    this.dispose = reaction(() => this.props[AvailableStores.SNACK_MANAGER].counter, this.onNewSnack.bind(this))
  }

  public componentWillUnmount (): void {
    this.dispose()
  }

  public render () {
    const { message: current, hasNext } = this.props[AvailableStores.SNACK_MANAGER]
    const duration = hasNext() ? SnackBarHandler.MIN_VISIBLE_SNACK_TIME_IN_MS : SnackBarHandler.MAX_VISIBLE_SNACK_TIME_IN_MS

    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={this.open}
        autoHideDuration={duration}
        onClose={() => {
          this.closeCurrentSnack()
        }}
        onExited={() => {
          this.openNextSnack()
        }}
        message={<span id="message-id">{current}</span>}
        action={
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => {
              this.closeCurrentSnack()
            }}
          >
            <Close />
          </IconButton>
        }
      />
    )
  }

  private onNewSnack (): void {
    const { open, openWhen } = this

    if (!open) {
      this.openNextSnack()
      return
    }

    const snackOpenSince = Date.now() - openWhen

    if (snackOpenSince > SnackBarHandler.MIN_VISIBLE_SNACK_TIME_IN_MS) {
      this.closeCurrentSnack()
    } else {
      setTimeout(this.closeCurrentSnack, SnackBarHandler.MIN_VISIBLE_SNACK_TIME_IN_MS - snackOpenSince)
    }
  }

  private openNextSnack (): void {
    if (this.props[AvailableStores.SNACK_MANAGER].hasNext()) {
      this.open = true
      this.openWhen = Date.now()
      this.props[AvailableStores.SNACK_MANAGER].next()
    }
  }

  private closeCurrentSnack (): void {
    this.open = false
  }
}

export default inject(AvailableStores.SNACK_MANAGER)(SnackBarHandler)
