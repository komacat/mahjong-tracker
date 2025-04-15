import { UpdateEvent, update_events } from '$lib/stores/update'

export function GET() {
    const event = new UpdateEvent()
    update_events.push(event)

    const stream = new ReadableStream({
        start(controller) {
            event.on('update', () => {
                controller.enqueue('event: update\ndata: {"message": "State updated"}\n\n')
            })
        },
        cancel() {
            const index = update_events.indexOf(event)
            if (~index) update_events.splice(index, 1)
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
