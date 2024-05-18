import { auth, createSessionCookie } from '../auth';
import { queryAuthCredentials, queryUserUsernames } from '../db/queries';
import {
	authGuardMiddleware,
	loginFormValidator,
	signUpFormValidator
} from '../middlewares';
import { createUser } from '../db/mutations';
import type {
	AuthFormSchema,
	FormErrorResponse,
	UserFormSchema,
	AppBindings
} from '../../types';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { StatusCodes } from 'http-status-codes';
import { Argon2id } from 'oslo/password';

const route = new Hono<AppBindings>()
	.get('/me', authGuardMiddleware, async (c) => {
		const { user } = c.var;
		return c.json({
			user
		});
	})
	.get('/session', authGuardMiddleware, async (c) => {
		const { user, session } = c.var;
		return c.json({
			user,
			session
		});
	})
	.post('/signup', signUpFormValidator, async (c) => {
		const formData = c.req.valid('form');

		const [userUsername] = await queryUserUsernames.execute({
			username: formData.username
		});

		if (userUsername) {
			const response: FormErrorResponse<UserFormSchema> = {
				message: 'Username already Exists',
				fields: { username: ['Username already Exists'] }
			};
			return c.json(response, StatusCodes.UNPROCESSABLE_ENTITY);
		}

		const [userEmail] = await queryUserUsernames.execute({
			username: formData.username
		});

		if (userEmail) {
			const response: FormErrorResponse<UserFormSchema> = {
				message: 'Email already Exists',
				fields: { email: ['Email already Exists'] }
			};
			return c.json(response, StatusCodes.UNPROCESSABLE_ENTITY);
		}

		await createUser(formData);

		return c.json({
			message: 'Success'
		});
	})
	.post('/login', loginFormValidator, async (c) => {
		const { key, password } = c.req.valid('form');

		const [user] = await queryAuthCredentials.execute({
			username: key,
			email: key
		});

		const invalidResponse: FormErrorResponse<AuthFormSchema> = {
			message: 'Invalid Credentials',
			fields: {
				key: ['Invalid Credentials'],
				password: ['Invalid Credentials']
			}
		};

		if (!user) {
			return c.json(invalidResponse, StatusCodes.UNPROCESSABLE_ENTITY);
		}

		const validPassword = await new Argon2id().verify(user.password, password);

		if (!validPassword) {
			return c.json(invalidResponse, StatusCodes.UNPROCESSABLE_ENTITY);
		}

		const { cookie, sessionId } = await createSessionCookie(user.id);

		c.header('Set-Cookie', cookie, {
			append: true
		});

		return c.json({
			message: sessionId
		});
	})
	.post('/logout', async (c) => {
		if (c.var.session) {
			await auth.invalidateSession(c.var.session.id);
			c.set('session', null);
			c.set('user', null);
			return c.redirect('/login');
		} else {
			throw new HTTPException(StatusCodes.UNAUTHORIZED, {
				message: 'You are not logged in!'
			});
		}
	})
	.get('/pogi/:id', async (c) => {
		return c.json({ message: 'true' });
	});

export default route;
