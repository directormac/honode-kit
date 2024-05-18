<script lang="ts">
	import { enhance } from '$app/forms';
	import type {
		AuthFormSchema,
		MappedFieldErrors
	} from '@honode-kit/shared/types';

	let { form } = $props();

	let fields = $state<Partial<AuthFormSchema>>({});
	let message = $state('');
	let errorFields = $state<MappedFieldErrors<AuthFormSchema>>();

	$effect(() => {
		if (form && typeof form.errors === 'object') {
			errorFields = form.errors.fields as MappedFieldErrors<AuthFormSchema>;
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
{#snippet field(name: keyof AuthFormSchema, type: HTMLInputElement['type'], label: string)}
	<div class="form-group">
		<label for={name}>{label}</label>
		<input {name} {type} bind:value={fields[name]} />
		{#if errorFields && errorFields[name]}
			<p>{errorFields[name]}</p>
		{/if}
	</div>
{/snippet}
<form method="POST" use:enhance>
	{#if message}
		<p>{message}</p>
	{/if}

	{@render field('key', 'key', 'Username/Email')}

	{@render field('password', 'password', 'Password')}

	<input type="submit" value="Login" />
</form>

<p>No account yet? <a href="/signup">Signup here</a></p>

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
