<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import '@fontsource-variable/alumni-sans';
	import '@fontsource-variable/inter';
	import '@fontsource-variable/jetbrains-mono';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<main class="flex min-h-screen h-screen gap-8 p-10">
	<nav class="flex w-60 flex-col justify-between py-8">
		<ul class="flex flex-col gap-4 text-lg font-bold text-white">
			<li class="rounded-lg bg-linear-to-r from-white/20 to-white/5 p-2">
				<a href="/dashboard">Dashboard</a>
			</li>
			<li class="rounded-lg p-2">
				<a href="/analise">Análise</a>
			</li>
			<li class="rounded-lg p-2">
				<a href="/automacao">Automação</a>
			</li>
		</ul>

		<img src="/img/logo.webp" , alt="Logomarca Ousaria" class="w-50 object-contain" />
	</nav>

	{@render children()}
</main>
