import { zValidator } from '@hono/zod-validator';
import {
	changePasswordSchema,
	processZodError,
	type ChangePasswordFormSchema
} from '../../types';
import { StatusCodes } from 'http-status-codes';

export const changePasswordFormValidator = zValidator(
	'form',
	changePasswordSchema,
	(result, c) => {
		if (!result.success) {
			const response = processZodError<ChangePasswordFormSchema>(
				'Invalid form',
				result.error
			);
			return c.json(response, StatusCodes.UNPROCESSABLE_ENTITY);
		}
	}
);
