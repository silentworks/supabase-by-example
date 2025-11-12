<script lang="ts">
	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { class: className = '', children }: Props = $props();
	
</script>

<div class="alert {className} shadow-lg rounded-none">
	{@render children?.()}
</div>
