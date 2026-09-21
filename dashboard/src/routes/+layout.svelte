<script>
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import Navigation from '$lib/components/Navigation.svelte';
	import { initializeData } from '$lib/data/csvData';

	import '@fontsource-variable/alumni-sans';
	import '@fontsource-variable/inter';
	import '@fontsource-variable/jetbrains-mono';

	let { children } = $props();

	onMount(() => {
		initializeData();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<main class="relative flex h-screen min-h-0 overflow-hidden p-4 pt-20 lg:gap-8 lg:p-6">
	<Navigation />

	<div
		class="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-mist-100 p-4 sm:p-6"
	>
		<div class="mb-4 flex items-center justify-between rounded-lg bg-primary px-6 py-2 font-bold">
			<p>Comunidade Voo</p>
			<p class="text-lg tracking-wide">ousar<span class="text-secondary">!</span>a</p>
		</div>
		<div class="min-h-0 min-w-0 flex-1 overflow-y-auto pr-1">
			{@render children()}
		</div>
	</div>
</main>
