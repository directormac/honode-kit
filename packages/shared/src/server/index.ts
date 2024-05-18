import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { showRoutes } from 'hono/dev';
import { csrf } from 'hono/csrf';
import { streamSSE } from 'hono/streaming';
import { HTTPException } from 'hono/http-exception';
import { format } from 'date-fns';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { AppBindings } from '../types';
import { auth, users } from './routes';
import { authMiddleware } from './middlewares';

/* -------------------------------------------------------------------------- */
/*                                     App                                    */
/* -------------------------------------------------------------------------- */

const hono = new Hono<AppBindings>();

hono.use(
	'*',
	cors({
		origin: ['http://localhost:3000', 'http://localhost:5173'],
		maxAge: 600,
		credentials: true
	})
);

hono.use('*', prettyJSON());

hono.use('/api/*', logger());

hono.use(
	'/api/*',
	csrf({
		origin: ['http://localhost:3000', 'http://localhost:5173']
	})
);

hono.use(authMiddleware);

hono.notFound((c) =>
	c.json({ message: ReasonPhrases.NOT_FOUND }, StatusCodes.NOT_FOUND)
);

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */
const routes = hono
	.basePath('/api')
	.get('/', () => {
		throw new HTTPException(StatusCodes.FORBIDDEN, {
			message: ReasonPhrases.FORBIDDEN
		});
	})
	.get('/ok', async (c) => {
		return c.json({
			message: 'OK'
		});
	})
	.get('/healthcheck', (c) => c.text('OK'))
	.get('/time', (c) => {
		return streamSSE(c, async (stream) => {
			while (true) {
				await stream.writeSSE({
					data: format(new Date(), 'MMMM do yyyy HH:mm:ss'),
					event: 'time-update',
					id: 'hono-sveltekit'
				});
				stream.write(format(new Date(), 'MMMM do yyyy HH:mm:ss'));
				await stream.sleep(1000);
			}
		});
	})
	.route('/auth', auth)
	.route('/users', users);

showRoutes(hono);
/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */
export default hono;

export { hono, routes };
