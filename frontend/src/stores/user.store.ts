import { IUser } from '@interfaces/interface'
import axios from 'axios'
import { action } from 'mobx'

import { BaseStore } from '../common/BaseStore'
import * as config from '../config'
import { SnackReporter } from '../snack/SnackManager'

export class UserStore extends BaseStore<IUser> {
  constructor (private readonly snack: SnackReporter) {
    super()
  }

  @action
  public async create (name: string, pass: string, admin: boolean): Promise<void> {
    await axios.post(`${config.get('url')}user`, {
      name,
      pass,
      admin
    })
    await this.refresh()
    this.snack('User created')
  }

  @action
  public async update (id: number, name: string, pass: string | null, admin: boolean): Promise<void> {
    await axios.post(config.get('url') + 'user/' + id, {
      name,
      pass,
      admin
    })
    await this.refresh()
    this.snack('User updated')
  }

  protected async requestItems (): Promise<IUser[]> {
    const response = await axios.get<IUser[]>(`${config.get('url')}user`)

    return response.data
  }

  protected async requestDelete (id: number): Promise<void> {
    await axios.delete(`${config.get('url')}user/${id}`)

    this.snack('User deleted.')
  }

}
