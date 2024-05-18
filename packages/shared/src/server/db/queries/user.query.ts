import { user } from '../../../schemas';
import { db, eq, sql, or, like } from '..';
import { withPagination } from '.';

export const queryAuthCredentials = db
	.select({ id: user.id, password: user.password })
	.from(user)
	.where(
		or(
			eq(user.email, sql.placeholder('email')),
			eq(user.username, sql.placeholder('username'))
		)
	)
	.prepare('query_auth_credentials');

export const queryUserUsernames = db
	.select({ id: user.id })
	.from(user)
	.where(eq(user.username, sql.placeholder('username')))
	.prepare('query_user_usernames');

export const queryUserEmails = db
	.select({ id: user.id })
	.from(user)
	.where(eq(user.email, sql.placeholder('email')))
	.prepare('query_user_emails');

const queryUser = db
	.select({
		id: user.id,
		username: user.username,
		email: user.email,
		name: user.name,
		role: user.role,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt
	})
	.from(user)
	.groupBy(user.id)
	.$dynamic();

export const queryUsers = (
	page: number = 0,
	limit: number = 10,
	q: string = ''
) =>
	withPagination(
		queryUser.where(
			or(
				like(user.username, `${q}%`),
				like(user.email, `${q}%`),
				like(user.name, `${q}%`)
			)
		),
		page,
		limit
	);

export const queryUserById = queryUser
	.where(eq(user.id, sql.placeholder('id')))
	.prepare('query_user_by_id');
