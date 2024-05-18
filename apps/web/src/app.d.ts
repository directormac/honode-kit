// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { User, Session } from '@honode-kit/shared/types';
import type { ClientType } from '$lib/api';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			api: ClientType['api'];
			user: User | null;
			session: Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
