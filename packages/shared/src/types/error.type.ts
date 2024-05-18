import { ZodError } from 'zod';

type FieldErrors = Record<string, string[]>;

export type MappedFieldErrors<T = FieldErrors> = {
	[K in keyof T]: string[];
};

export type FormErrorResponse<T = FieldErrors> = {
	message: string;
	fields: MappedFieldErrors<Partial<T>>;
};

export function processZodError<T = FieldErrors>(
	message: string = 'Invalid form',
	zodError: ZodError<any>
): FormErrorResponse {
	const fields: Partial<MappedFieldErrors<T>> = {};

	zodError.errors.forEach((error) => {
		if (error.path.length > 0) {
			const fieldName = error.path[0] as keyof T;
			if (!fields[fieldName]) {
				fields[fieldName] = [];
			}
			(fields[fieldName] as string[]).push(error.message);
		}
	});

	return {
		message,
		fields: fields as MappedFieldErrors<T>
	};
}
