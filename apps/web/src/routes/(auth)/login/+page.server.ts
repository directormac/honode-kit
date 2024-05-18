import { decode } from 'decode-formdata';
import type { Actions } from './$types';
import type { AuthFormSchema } from '@honode-kit/shared/types';
import { parseApiResponse } from '@honode-kit/shared/utils';
import { fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from '@honode-kit/shared/constants';
import { env } from '$env/dynamic/private';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = decode<AuthFormSchema>(await request.formData());

		const response = await parseApiResponse(
			locals.api.auth.login.$post({
				form
			})
		);

		if (response.errors) {
			return fail(StatusCodes.UNPROCESSABLE_ENTITY, {
				fields: form,
				errors: response.errors
			});
		} else {
			redirect(302, '/');
		}
	}
};
