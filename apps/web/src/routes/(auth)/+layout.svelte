<script lang="ts">
	let { children } = $props();
</script>

<main class="grid justify-items-center gap-y-12 py-4">
	{@render children()}
</main>
