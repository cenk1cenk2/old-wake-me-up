import { action, observable } from 'mobx'

export type SnackReporter = typeof SnackManager.prototype.show

export class SnackManager {
  @observable
  public message: string | null = null
  @observable
  public counter = 0
  @observable
  private messages: string[] = []

  @action
  public next (): void {
    if (!this.hasNext()) {
      throw new Error('No notification left.')
    }

    this.message = this.messages.shift() as string
  }

  @action
  public show (message: string) : void {
    this.messages.push(message)
    this.counter++
  }

  public hasNext (): boolean {
    return this?.messages?.length > 0
  }
}
