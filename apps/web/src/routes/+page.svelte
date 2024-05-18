<script lang="ts">
	import type { PageData } from './$types';
	import { api } from '@honode-kit/shared/client';

	let currentTime = $state('');

	$effect(() => {
		const eventSource = new EventSource('/api/time');

		eventSource.onmessage = (event) => {
			currentTime = event.data;
		};

		return () => {
			eventSource.close();
		};
	});

	type Props = {
		data: { user: PageData['user'] | null };
	};

	let { data }: Props = $props();
	let user = $state<Props['data']['user']>(data.user);

	const healthcheck = async () => {
		const req = await api.healthcheck.$get();
		return await req.text();
	};
</script>

<h1>Welcome to SvelteKit</h1>

<p>
	Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

{#if user}
	<div style="display: grid; gap: 1rem;">
		<p>welcome back, {user.name}!</p>

		{#if user.role === 'admin'}
			<a href="/admin/users">Manage Users</a>
		{/if}

		<form method="POST" action="/api/auth/logout">
			<input type="submit" value="logout" />
		</form>
	</div>
{:else}
	<div style="display: grid; gap: 1rem;">
		<p>No account yet? <a href="/signup">Signup here</a></p>
		<p>Already have an account? <a href="/login">Login here</a></p>
	</div>
{/if}

{#await healthcheck() then ok}
	<div style="padding: 1rem 1rem 0 0;">
		Server is {ok}

		<p>{currentTime}</p>
	</div>
{/await}
