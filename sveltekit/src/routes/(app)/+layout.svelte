<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>Supabase by example</title>
	<meta name="description" content="Supabase by example showcasing it's auth features.">
</svelte:head>

<main data-theme="winter">
	<div class="flex flex-col h-screen">
		<div class="navbar border-b border-gray-300 py-8 px-4">
			<div class="flex-1">
				<h1 class="font-semibold">
					<a href="/">Supabase by example</a>
				</h1>
			</div>
			<div class="flex-none space-x-10">
				<a class="btn btn-outline" href="/account">Account</a>
				<form action="/auth/signout" method="post">
					<button class="btn btn-ghost">Sign out</button>
				</form>
			</div>
		</div>
		<div class="grid place-items-center my-20 mx-2">
			{@render children?.()}
		</div>
	</div>
</main>
