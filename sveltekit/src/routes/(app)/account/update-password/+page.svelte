<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import InputErrorMessage from '#lib/InputErrorMessage.svelte';
	import Alert from '#lib/Alert.svelte';
	import { enhance } from '$app/forms';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();
</script>

<div
	class="w-11/12 p-12 px-6 py-10 rounded-lg sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-3/12 sm:px-10 sm:py-6"
>
	{#if form?.message !== undefined}
		<Alert class="{form?.success ? 'alert-info' : 'alert-error'} mb-10">{form?.message}</Alert>
	{/if}
	<h2 class="font-semibold text-4xl mb-4">Update Password</h2>
	<p class="font-medium mb-4">
		Hi {data.session?.user.email}, Enter your new password below and confirm it
	</p>
	<form class="" method="post" use:enhance>
		<div class="fieldset">
			<label for="password" class="fieldset-legend">Password</label>
			<input
				id="password"
				name="password"
				type="password"
				value={form?.password ?? ''}
				class="input w-full"
			/>
		</div>
		{#if form?.errors?.password}
			<InputErrorMessage>{form?.errors?.password}</InputErrorMessage>
		{/if}
		<div class="fieldset">
			<label for="passwordConfirm" class="fieldset-legend">Confirm Password</label>
			<input
				id="passwordConfirm"
				name="passwordConfirm"
				type="password"
				value=""
				class="input w-full"
			/>
		</div>
		{#if form?.errors?.passwordConfirm}
			<InputErrorMessage>{form?.errors?.passwordConfirm}</InputErrorMessage>
		{/if}
		<div class="flex flex-col mt-6">
			<button class="btn btn-primary">Update Password</button>
		</div>
	</form>
</div>
