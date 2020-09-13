import { action, observable } from 'mobx'

import { IClearable, IHasID } from './base.store.interface'

export abstract class BaseStore<T extends IHasID> implements IClearable {
  @observable
  protected items: T[] = []

  @action
  public async remove (id: number): Promise<void> {
    await this.requestDelete(id)
    await this.refresh()
  }

  @action
  public async refresh (): Promise<void> {
    this.items = await this.requestItems() ?? []
  }

  @action
  public clear (): void {
    this.items = []
  }

  public getByID (id: number): T {
    const item = this.getByIDOrUndefined(id)
    if (typeof item === 'undefined') {
      throw new Error('cannot find item with id ' + id)
    }
    return item
  }

  public getByIDOrUndefined (id: number): T | undefined {
    return this.items.find((hasId: IHasID) => hasId.id === id)
  }

  public getItems (): T[] {
    return this.items
  }

  protected abstract requestItems (): Promise<T[]>

  protected abstract requestDelete (id: number): Promise<void>
}
