import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'

export class UpdateEvent extends EventEmitter {
    id: string

    constructor() {
        super();
        this.id = uuidv4()
    }
    notify() {
        this.emit('update')
    }
}

export const update_events: Map<string, UpdateEvent> = new Map()

export function send_update() {
    for (const [, event] of update_events) {
        event.notify()
    }
}
