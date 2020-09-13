import { IUser } from '@interfaces/interface'
import axios from 'axios'
import { action } from 'mobx'

import * as config from '../configuration'
import { SnackReporter } from '../snack/SnackManager'
import { BaseStore } from './base.store'

export class UserStore extends BaseStore<IUser> {
  private url = config.get('url')

  constructor (private readonly snack: SnackReporter) {
    super()
  }

  @action
  public async create (name: string, pass: string, admin: boolean): Promise<void> {
    await axios.post(this.url + 'user', {
      name,
      pass,
      admin
    })
    await this.refresh()

    this.snack('User created')
  }

  @action
  public async update (id: number, name: string, pass: string | null, admin: boolean): Promise<void> {
    await axios.post(this.url + 'user/' + id, {
      name,
      pass,
      admin
    })
    await this.refresh()

    this.snack('User updated.')
  }

  protected async requestItems (): Promise<IUser[]> {
    const response = await axios.get<IUser[]>(this.url + 'user')

    return response.data
  }

  protected async requestDelete (id: number): Promise<void> {
    await axios.delete(this.url + `user/${id}`)

    this.snack('User deleted.')
  }
}
