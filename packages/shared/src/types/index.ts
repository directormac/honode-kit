import type { User, Session } from 'lucia';
import type { USER_ROLES } from '../constants';
import type { FormErrorResponse } from './error.type';

type UserRole = (typeof USER_ROLES)[number];

type ApiResponse<T> = {
	data: T | null;
	errors: FormErrorResponse | string | null;
	status: number;
	message: string | null;
};

export type AppBindings = {
	Variables: {
		user: User | null;
		session: Session | null;
	};
};

export type { User, UserRole, Session, ApiResponse };

export * from './error.type';
export * from './user.type';
export * from './util.type';
