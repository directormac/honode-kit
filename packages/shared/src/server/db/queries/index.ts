import type { PgSelect } from 'drizzle-orm/pg-core';

export const withPagination = <T extends PgSelect>(
	query: T,
	page: number = 0,
	limit: number = 10
) => {
	return query.limit(limit).offset(page * limit);
};

export * from './user.query';
