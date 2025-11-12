<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<span class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
	{@render children?.()}
</span>
