import { EventEmitter } from 'events'

export class RPC {
  private connection: EventEmitter

  constructor() {
    this.connection = new EventEmitter()
  }

  on = (event: string, callback: (...args: any[]) => any) => {
    this.connection.on(event, (obj = {}, ...args) => {
      const data = callback(...args)
      obj.data = data
    })
  }

  emit<T>(event: string, ...args: any[]): T {
    const obj: { data: undefined | T } = { data: undefined }
    this.connection.emit(event, obj, ...args)
    return obj.data as T
  }
}
