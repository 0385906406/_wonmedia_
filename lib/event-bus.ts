import EventEmitter from 'events'

declare global {
  // eslint-disable-next-line no-var
  var __eventBus: EventEmitter | undefined
}

const eventBus: EventEmitter =
  global.__eventBus ?? (global.__eventBus = new EventEmitter())

eventBus.setMaxListeners(200)

export { eventBus }
