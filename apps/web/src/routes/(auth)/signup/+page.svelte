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

<h2>Login Page</h2>

{#if message}
	<p>{message}</p>
{/if}

{#snippet field(name: keyof UserFormSchema, type: HTMLInputElement['type'], label: string)}
	<div class="form-group">
		<label for={name}>{label}</label>
		<input {name} {type} bind:value={fields[name]} />
		{#if errorFields && errorFields[name]}
			<p>{errorFields[name]}</p>
		{/if}
	</div>
{/snippet}

<form method="POST" use:enhance>
	{@render field('username', 'text', 'Username')}
	{@render field('email', 'email', 'Email')}
	{@render field('name', 'text', 'Name')}
	{@render field('password', 'password', 'Password')}
	<input type="submit" value="Sign Up" />
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
