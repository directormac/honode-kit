import type { ApiResponse, FormErrorResponse } from '../types';
import type { ClientResponse } from 'hono/client';
import { StatusCodes } from 'http-status-codes';

// TODO: Improve this from hono regular responses

export async function parseApiResponse<T>(
	fetchCall: Promise<ClientResponse<T>>
): Promise<ApiResponse<T>> {
	const response = await fetchCall;
	const status = response.status;
	let data: T | null = null;
	let errors: ApiResponse<T>['errors'] = null;
	let message: ApiResponse<T>['message'] = null;

	if (response.ok) {
		// TODO: Still getting wrong response here when returning things like custom object
		// e.g { token: string}
		// Should not cast as T
		data = (await response.json()) as T;
	} else {
		try {
			errors =
				status !== StatusCodes.UNPROCESSABLE_ENTITY
					? await response.text()
					: ((await response.json()) as FormErrorResponse);
		} catch {
			errors = 'Something went wrong.';
		}
	}

	return { data, errors, status, message };
}
