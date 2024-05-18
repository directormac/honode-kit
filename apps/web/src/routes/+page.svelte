<script lang="ts">
	import type { PageData } from './$types';

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

	let { data } = $props();
	let user = $state<PageData['user']>(data.user);
</script>

<main class="grid justify-items-center gap-y-3.5 py-4">
	<h1 class="font-bold">Welcome to SvelteKit</h1>

	<p>
		Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
	</p>

	{#if user}
		<div style="display: grid; gap: 1rem;">
			<p>welcome back, {user.name}!</p>

			{#if user.role === 'admin'}
				<a class="hover:underline" href="/admin/users">Manage Users</a>
			{/if}

			<form method="POST" action="/api/auth/logout">
				<input
					type="submit"
					value="logout"
					class="rounded border-0 bg-indigo-500 px-6 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none"
				/> />
			</form>
		</div>
	{:else}
		<div style="display: grid; gap: 1rem;">
			<p>
				No account yet? <a class="hover:underline" href="/signup">Signup here</a
				>
			</p>
			<p>
				Already have an account? <a class="hover:underline" href="/login"
					>Login here</a
				>
			</p>
		</div>
	{/if}

	{#await data.healthcheck then ok}
		<div style="padding: 1rem 1rem 0 0;">
			<p>
				Server is {ok}:
				{currentTime}
			</p>
		</div>
	{/await}
</main>
