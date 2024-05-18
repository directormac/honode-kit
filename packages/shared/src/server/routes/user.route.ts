import type { AppBindings } from '../../types';
import {
	authGuardMiddleware,
	queryParamsValidator,
	signUpFormValidator,
	changePasswordFormValidator
} from '../middlewares';
import { Hono } from 'hono';
import { queryUsers } from '../db/queries';
import { changePassword } from '../db/mutations';
import { HTTPException } from 'hono/http-exception';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const route = new Hono<AppBindings>()
	.get('/', authGuardMiddleware, queryParamsValidator, async (c) => {
		const { q, limit, page } = c.req.valid('query');

		const user = c.var.user;

		if (user && user.role === 'user') return c.json({ users: [c.var.user] });

		try {
			const users = await queryUsers(page, limit, q);
			return c.json({
				users
			});
		} catch {
			return c.json({
				users: []
			});
		}
	})
	.patch('/', signUpFormValidator, async (c) => {
		return c.json({
			message: 'Success'
		});
	})
	.delete('/', async (c) => {
		return c.json({
			message: 'Success'
		});
	})
	.patch(
		'/change-password',
		authGuardMiddleware,
		changePasswordFormValidator,
		async (c) => {
			const { password } = c.req.valid('form');
			const user = c.var.user;

			if (!user)
				throw new HTTPException(StatusCodes.UNAUTHORIZED, {
					message: ReasonPhrases.UNAUTHORIZED
				});

			await changePassword(user.id!, password);
			return c.json({
				message: 'Success'
			});
		}
	);

export default route;
