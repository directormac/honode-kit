import 'dotenv/config';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import api from '@routes/index';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';
import { serveStatic } from '@hono/node-server/serve-static';

export const dev = process.env.NODE_ENV === 'development';

const app = new Hono();

app.use(
	'*',
	cors({
		origin: [
			'http://localhost:3000',
			'http://localhost:5173',
			'http://localhost:8787'
		],
		maxAge: 600,
		credentials: true
	})
);

app.use('*', prettyJSON());

app.use('/api/*', logger());

app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));

const routes = app.route('', api);

app.get('*', serveStatic({ root: dev ? '../web/build' : './public' }));
app.get(
	'*',
	serveStatic({ root: dev ? '../web/build/index.html' : './public/index.html' })
);

showRoutes(app);

export default app;

export type AppType = typeof routes;
