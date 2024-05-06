import 'dotenv/config';
import { serve } from '@hono/node-server';
import { WebSocketServer } from 'ws';
import { Server } from 'http';
import app from '@app';

const port = Number(process.env.PORT) || 3000;

const server = serve(
	{
		fetch: app.fetch,
		port
	},
	(info) => {
		console.log(`Listening on port http://${info.address}:${info.port}`);
	}
);

const wss = new WebSocketServer({ server: server as Server });

wss.on('connection', (ws) => {
	let counter = 1;

	ws.addEventListener('message', (event) => {
		if (event.data === 'ping' && counter < 73) {
			ws.send(`Pong ${counter++}`);
		} else {
			ws.send(`Max Ping reached. Closing connection.`);
			ws.close(1000, 'No more pings allowed. Closing connection.');
			counter = 1;
		}
	});
});
