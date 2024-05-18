import { auth } from '../auth';
import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import {
	type AuthFormSchema,
	type UserFormSchema,
	type AppBindings,
	authSchema,
	processZodError,
	userFormSchema
} from '../../types';

export const authMiddleware = createMiddleware<AppBindings>(async (c, next) => {
	let sessionId = getCookie(c, auth.sessionCookieName) ?? null;

	if (!sessionId) {
		const token = c.req.header('Authorization') ?? null;
		sessionId = auth.readBearerToken(token ?? '');
	}

	if (!sessionId) {
		c.set('session', null);
		c.set('user', null);
		return next();
	}

	const { session, user } = await auth.validateSession(sessionId);
	if (session && session.fresh) {
		c.header('Set-Cookie', auth.createSessionCookie(session.id).serialize(), {
			append: true
		});
	}
	if (!session) {
		c.header('Set-Cookie', auth.createBlankSessionCookie().serialize(), {
			append: true
		});
	}

	c.set('session', session);
	c.set('user', user);
	return next();
});

// TODO: The following guards should also reflect the data from the auth/route.rules module
export const authGuardMiddleware = createMiddleware<AppBindings>(
	async (c, next) => {
		if (!c.var.user)
			throw new HTTPException(StatusCodes.UNAUTHORIZED, {
				message: ReasonPhrases.UNAUTHORIZED
			});

		return await next();
	}
);
export const adminGuardMiddleware = createMiddleware<AppBindings>(
	async (c, next) => {
		if (!c.var.user)
			throw new HTTPException(StatusCodes.UNAUTHORIZED, {
				message: ReasonPhrases.UNAUTHORIZED
			});

		if (c.var.user && c.var.user.role !== 'admin')
			throw new HTTPException(StatusCodes.UNAUTHORIZED, {
				message: ReasonPhrases.UNAUTHORIZED
			});

		return next();
	}
);

export const loginFormValidator = zValidator(
	'form',
	authSchema,
	(result, c) => {
		if (!result.success) {
			const response = processZodError<AuthFormSchema>(
				'Invalid form',
				result.error
			);
			return c.json(response, StatusCodes.UNPROCESSABLE_ENTITY);
		}
	}
);

export const signUpFormValidator = zValidator(
	'form',
	userFormSchema,
	(result, c) => {
		if (!result.success) {
			const response = processZodError<UserFormSchema>(
				'Invalid form',
				result.error
			);
			return c.json(response, StatusCodes.UNPROCESSABLE_ENTITY);
		}
	}
);
