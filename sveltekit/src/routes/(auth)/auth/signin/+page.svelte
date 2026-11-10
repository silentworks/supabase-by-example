<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import Alert from '#lib/Alert.svelte';
	import InputErrorMessage from '#lib/InputErrorMessage.svelte';
	import type { ActionData, PageData } from './$types';

	interface Props {
		form: ActionData;
		data: PageData;
	}

	let { form, data }: Props = $props();

	let isMagicLink = $state(data.authType == 'magic_link');
	let formAction = $derived(isMagicLink ? '?/magic_link' : '?/email_password');
	const magicLink = () => {
		const query = new SvelteURLSearchParams(page.url.searchParams.toString());
		const authType = query.get('auth_type');
		if (!authType) {
			query.set('auth_type', 'magic_link');
		} else {
			query.delete('auth_type');
		}
		goto(resolve(`auth/signin?${query.toString()}`));
	};
</script>

<div
	class="w-11/12 p-12 px-6 py-10 rounded-lg sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-3/12 sm:px-10 sm:py-6"
>
	{#if form?.message !== undefined}
		<Alert class="{form?.success ? 'alert-info' : 'alert-error'} mb-10">{form?.message}</Alert>
	{/if}
	<h2 class="font-semibold text-4xl mb-4">Sign in</h2>
	<p class="font-medium mb-4">Hi, Welcome back</p>
	<div class="space-y-2">
		<form method="post" action="?/oauth">
			<input type="hidden" name="provider" value="github" />
			<button
				class="btn btn-outline border-gray-200 hover:bg-transparent hover:text-gray-500 gap-2 w-full normal-case"
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					preserveAspectRatio="xMinYMin"
				>
					<use xlink:href="#img-github"></use>
				</svg>
				Continue with GitHub
			</button>
		</form>
		<form method="post" action="?/oauth">
			<input type="hidden" name="provider" value="google" />
			<button
				class="btn btn-outline border-gray-200 hover:bg-transparent hover:text-gray-500 gap-2 w-full normal-case"
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 48 48"
					xmlns="http://www.w3.org/2000/svg"
					version="1.1"
					preserveAspectRatio="xMinYMin"
				>
					<use xlink:href="#img-google"></use>
				</svg>
				Continue with Google
			</button>
		</form>
	</div>
	<div class="divider text-gray-400 text-sm">or continue with Email</div>
	<form class="" method="post" use:enhance>
		<div class="fieldset">
			<label for="email" class="fieldset-legend">Email</label>
			<input
				id="email"
				name="email"
				type="text"
				value={form?.email ?? ''}
				class="input w-full"
			/>
		</div>
		{#if form?.errors?.email}
			<InputErrorMessage>{form?.errors?.email}</InputErrorMessage>
		{/if}
		{#if !isMagicLink}
			<div class="fieldset">
				<label for="password" class="fieldset-legend">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					value=""
					class="input w-full"
				/>
			</div>
			{#if form?.errors?.password}
				<InputErrorMessage>{form?.errors?.password}</InputErrorMessage>
			{/if}
		{/if}
		<div class="flex flex-row justify-between pt-4">
			<label class="label justify-start cursor-pointer gap-2 text-gray-500">
				<input
					type="checkbox"
					class="toggle toggle-xs"
					onchange={magicLink}
					bind:checked={isMagicLink}
				/>
				Magic link login
			</label>
			{#if !isMagicLink}
				<a class="block py-2 text-blue-500" href={resolve('auth/forgotpassword')}>Forgot Password?</a>
			{/if}
		</div>
		<div class="flex flex-col mt-6">
			<button class="btn btn-primary" formaction={formAction}>Sign in</button>
		</div>
	</form>
	{#if !isMagicLink}
		<div class="pt-4 text-center">
			Not registered yet? <a href={resolve('auth/signup')} class="underline text-blue-500"
				>Create an account</a
			>
		</div>
	{/if}
</div>
