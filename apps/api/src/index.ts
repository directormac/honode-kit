import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

const routes = app
	.get('/', (c) => {
		return c.text('Hello Hono!');
	})
	.get('/hello/:name', (c) => c.json(c.req.query('name')));

export type AppRoutes = typeof routes;

const port = 3000;

serve(
	{
		fetch: app.fetch,
		port
	},
	(info) => {
		console.log(`Listening on ${info.address}:${info.port}`);
	}
);
