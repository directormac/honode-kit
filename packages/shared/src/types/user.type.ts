import { object, string, union, type infer as zInfer } from 'zod';
import { requiredString } from './util.type';
import { createInsertSchema } from 'drizzle-zod';
import { user } from '../schemas';

const password = string()
	.min(8, 'must be at least 8 characters long')
	.max(64, 'cannot exceed 64 characters')
	.regex(/\d/, 'includes at least one number')
	.regex(/[!@#$%^&*-~_?]/, 'includes at least one special character')
	.regex(/[A-Z]/, 'includes at least one uppercase letter')
	.regex(/[a-z]/, 'includes at least one lowercase letter');

export const changePasswordSchema = object({
	oldPasswod: string(),
	password,
	passwordConfirm: password
}).refine((data) => data.password === data.passwordConfirm, {
	path: ['passwordConfirm'],
	message: 'New Passwords do not match.'
});

export type ChangePasswordFormSchema = zInfer<typeof changePasswordSchema>;

const usernameSchema = requiredString('Username', { min: 3, max: 16 })
	.trim()
	.toLowerCase()
	.regex(/^[a-zA-Z0-9_]+$/, {
		message: 'Username can only contain alphanumeric characters and underscores'
	});

export const emailSchema = string({
	required_error: 'Email address is required'
}).email({
	message: 'Please enter a valid email address'
});

const accountKey = union([emailSchema, usernameSchema]);

export const authSchema = object({
	key: accountKey,
	password: string()
});

export type AuthFormSchema = zInfer<typeof authSchema>;

export const userFormSchema = createInsertSchema(user, {
	id: (schema) => schema.id.optional(),
	username: usernameSchema,
	password,
	createdAt: (schema) => schema.createdAt.optional(),
	updatedAt: (schema) => schema.updatedAt.optional()
});

export type UserFormSchema = zInfer<typeof userFormSchema>;
