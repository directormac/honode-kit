import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { streamSSE, streamText } from 'hono/streaming';

const routes = new Hono().basePath('/api');

routes.get('/', () => {
	throw new HTTPException(403, { message: 'Forbidden' });
});

routes.get('/healthcheck', (c) => c.text('OK'));

let id = 0;
routes.get('/current-time', (c) => {
	return streamSSE(c, async (stream) => {
		while (true) {
			const message = `${new Date().toString()}`;
			await stream.writeSSE({
				data: message,
				event: 'time-update',
				id: String(id++)
			});
			stream.write(new Date().toString());
			await stream.sleep(1000);
		}
	});
});

export default routes;
