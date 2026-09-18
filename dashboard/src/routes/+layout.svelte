<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import '@fontsource-variable/alumni-sans';
	import '@fontsource-variable/inter';
	import '@fontsource-variable/jetbrains-mono';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
