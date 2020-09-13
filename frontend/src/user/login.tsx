import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component, FormEvent } from 'react'

import Container from '../common/Container'
import DefaultPage from '../common/DefaultPage'
import { inject } from '@stores/inject-stores'
import { Stores, AvailableStores } from '@stores/inject-stores.interface'

@observer
class Login extends Component<Stores<AvailableStores.AUTH_STORE>> {
  @observable
  private username: string
  @observable
  private password: string

  public render () {
    const { username, password } = this
    return (
      <DefaultPage title="Login" maxWidth={640}>
        <Container>
          <Grid item xs={12}>
            <form onSubmit={(e) => this.preventDefault(e)} id="login-form">
              <Grid container style={{ textAlign: 'center' }} direction="column" justify="center" alignItems="stretch">
                <TextField autoFocus className="name" label="Username" margin="dense" value={username} onChange={(e) => (this.username = e.target.value)} />
                <TextField type="password" className="password" label="Password" margin="normal" value={password} onChange={(e) => (this.password = e.target.value)} />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  className="login"
                  color="primary"
                  disabled={!!this.props[AvailableStores.AUTH_STORE].connectionErrorMessage}
                  style={{ marginTop: 15, marginBottom: 5 }}
                  onClick={(e) => this.login(e)}
                >
                  Login
                </Button>
              </Grid>
            </form>
          </Grid>
        </Container>
      </DefaultPage>
    )
  }

  private login (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    this.props[AvailableStores.AUTH_STORE].login(this.username, this.password)
  }

  private preventDefault (e: FormEvent<HTMLFormElement>) {
    return e.preventDefault()
  }
}

export default inject(AvailableStores.AUTH_STORE)(Login)
