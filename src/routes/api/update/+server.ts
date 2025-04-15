import { UpdateEvent, update_events } from '$lib/stores/update'

export function GET() {
    const event = new UpdateEvent()
    update_events.set(event.id, event)

    const stream = new ReadableStream({
        start(controller) {
            event.on('update', () => {
                controller.enqueue('event: update\ndata: {"message": "State updated"}\n\n')
            })
        },
        cancel() {
            update_events.delete(event.id)
        },
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    })
}
