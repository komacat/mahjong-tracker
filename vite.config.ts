import { sveltekit } from '@sveltejs/kit/vite'
import { type ViteDevServer, defineConfig } from 'vite'
import { Server } from 'socket.io'

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return

		const io = new Server(server.httpServer)

		io.on('connection', (socket) => {
            socket.on('update', (state) => {
                socket.broadcast.emit('update', state);
            });
        });
	}
}

export default defineConfig({
    server: {
        host: '127.0.0.1'
    },
    plugins: [sveltekit(), webSocketServer],
})
