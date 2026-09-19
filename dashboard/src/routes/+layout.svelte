<script>
	import { resolve } from '$app/paths';
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

<main class="flex h-screen min-h-screen gap-8 p-6">
	<nav class="flex w-50 flex-col justify-between py-8 2xl:w-60">
		<ul class="flex flex-col gap-4 font-bold text-white 2xl:text-lg">
			<li class="rounded-lg bg-linear-to-r from-white/20 to-white/5 p-2">
				<a class="flex items-center gap-4" href={resolve('/')}><ChartNoAxesCombined /> Dashboard</a>
			</li>
			<li class="rounded-lg p-2">
				<a class="flex items-center gap-4" href={resolve('/relatorio')}><FileText /> Relatório</a>
			</li>
			<li class="rounded-lg p-2">
				<a class="flex items-center gap-4" href={resolve('/automacao')}><Settings /> Automação</a>
			</li>
		</ul>

		<img src="/img/logo-slogan.webp" alt="Logomarca Ousaria" class="w-44 object-contain 2xl:w-50" />
	</nav>

	<div class="h-full w-full rounded-2xl bg-mist-100 p-6">
		<div class="mb-4 flex items-center justify-between rounded-lg bg-primary px-6 py-2 font-bold">
			<p>Comunidade Voo</p>
			<p class="text-lg tracking-wide">ousar<span class="text-secondary">!</span>a</p>
		</div>
		{@render children()}
	</div>
</main>
