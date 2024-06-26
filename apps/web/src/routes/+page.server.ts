import { parseApiResponse } from '@honode-kit/shared/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data, status } = await parseApiResponse(locals.api.auth.me.$get());

	const healthcheck = locals.api.healthcheck.$get().then((res) => res.text());

	if (status === 200 && data) {
		return {
			user: data.user,
			healthcheck
		};
	}

	return {
		healthcheck
	};
};
