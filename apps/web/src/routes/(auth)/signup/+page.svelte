<script lang="ts">
	import { enhance } from '$app/forms';
	import type {
		MappedFieldErrors,
		UserFormSchema
	} from '@honode-kit/shared/types';

	let { form } = $props();

	let fields = $state<Partial<UserFormSchema>>({});
	let message = $state('');
	let errorFields = $state<MappedFieldErrors<UserFormSchema>>();

	$effect(() => {
		if (form && form.errors && typeof form.errors === 'object') {
			errorFields = form.errors.fields as MappedFieldErrors<UserFormSchema>;
			message = form.errors.message;
		} else if (form && typeof form.errors === 'string') {
			message = form.errors;
		}
	});

	$effect(() => {
		if (form && form.fields) {
			fields = form.fields;
		}
	});

	export const snapshot = {
		capture: () => ({ fields, message, errorFields }),
		restore: (value) => {
			fields = value.fields;
			message = value.message;
			errorFields = value.errorFields;
		}
	};
</script>

<h2 class="title-font text-2xl font-semibold tracking-widest">Signup Page</h2>

{#snippet field(name: keyof UserFormSchema, type: HTMLInputElement['type'], label: string)}
	<div class="form-group">
		<label class="text-sm leading-7 text-gray-600" for={name}>{label}</label>
		<input
			class="w-full rounded border border-gray-300 px-3 py-1 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
			id={name}
			{name}
			{type}
			bind:value={fields[name]}
		/>
		{#if errorFields && errorFields[name]}
			<p>{errorFields[name]}</p>
		{/if}
	</div>
{/snippet}

<form method="POST" use:enhance>
	{#if message}
		<p>{message}</p>
	{/if}
	{@render field('username', 'text', 'Username')}
	{@render field('email', 'email', 'Email')}
	{@render field('name', 'text', 'Name')}
	{@render field('password', 'password', 'Password')}
	<input
		class="rounded border-0 bg-indigo-500 px-6 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none"
		type="submit"
		value="Sign Up"
	/>
</form>

<p>Already have an account? <a href="/login">Login here</a></p>

<style>
	form {
		width: 400px;
		gap: 1rem;
		display: flex;
		flex-direction: column;
	}
	.form-group {
		display: flex;
		flex-direction: column;
	}
</style>
