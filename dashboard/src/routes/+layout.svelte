<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import '@fontsource-variable/alumni-sans';
	import '@fontsource-variable/inter';
	import '@fontsource-variable/jetbrains-mono';

	import ChartNoAxesCombined from '@lucide/svelte/icons/chart-no-axes-combined';
	import FileText from '@lucide/svelte/icons/file-text';
	import Settings from '@lucide/svelte/icons/settings';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<main class="flex h-screen min-h-screen gap-8 p-6 2xl:p-10">
	<nav class="flex w-50 2xl:w-60 flex-col justify-between py-8">
		<ul class="flex flex-col gap-4 2xl:text-lg font-bold text-white">
			<li class="rounded-lg bg-linear-to-r from-white/20 to-white/5 p-2">
				<a class="flex items-center gap-4" href="/dashboard"><ChartNoAxesCombined /> Dashboard</a>
			</li>
			<li class="rounded-lg p-2">
				<a class="flex items-center gap-4" href="/relatorio"><FileText /> Relatório</a>
			</li>
			<li class="rounded-lg p-2">
				<a class="flex items-center gap-4" href="/automacao"><Settings /> Automação</a>
			</li>
		</ul>

		<img src="/img/logo.webp" , alt="Logomarca Ousaria" class="w-44 2xl:w-50 object-contain" />
	</nav>

	{@render children()}
</main>
