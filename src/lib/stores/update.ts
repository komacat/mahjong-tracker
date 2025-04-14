import { EventEmitter } from "events";

export class UpdateEvent extends EventEmitter {
	notify() {
		this.emit('update');
	}
}

export const update_events: UpdateEvent[] = [];

export function send_update() {
	for (const event of update_events) {
		event.notify();
	}
}