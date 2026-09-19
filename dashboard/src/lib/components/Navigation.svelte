<script>
	import { resolve } from '$app/paths';
	import ChartNoAxesCombined from '@lucide/svelte/icons/chart-no-axes-combined';
	import FileText from '@lucide/svelte/icons/file-text';
	import Menu from '@lucide/svelte/icons/menu';
	import Settings from '@lucide/svelte/icons/settings';
	import X from '@lucide/svelte/icons/x';

	let menuOpen = $state(false);

	const closeMenu = () => {
		menuOpen = false;
	};

	const toggleMenu = () => {
		menuOpen = !menuOpen;
	};

	const handleKeydown = (event) => {
		if (event.key === 'Escape') {
			closeMenu();
		}
	};
</script>

<svelte:window onkeydown={handleKeydown} />

<button
	type="button"
	class="fixed top-4 left-4 z-60 inline-flex size-11 items-center justify-center rounded-lg bg-primary text-white shadow-lg transition hover:bg-primary/90 focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-primary focus:outline-none lg:hidden"
	aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
	aria-expanded={menuOpen}
	aria-controls="main-navigation"
	onclick={toggleMenu}
>
	{#if menuOpen}
		<X size={22} strokeWidth={2.25} />
	{:else}
		<Menu size={22} strokeWidth={2.25} />
	{/if}
</button>

{#if menuOpen}
	<button
		type="button"
		class="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
		aria-label="Fechar menu"
		onclick={closeMenu}
	></button>
{/if}

<nav
	id="main-navigation"
	aria-label="Navegação principal"
	class={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col justify-between bg-primary px-6 py-8 shadow-2xl transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-50 lg:max-w-none lg:translate-x-0 lg:bg-transparent lg:px-0 lg:py-8 lg:shadow-none 2xl:w-60 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
>
	<ul class="flex flex-col gap-4 font-bold text-white 2xl:text-lg">
		<li class="rounded-lg bg-linear-to-r from-white/20 to-white/5 p-2">
			<a class="flex items-center gap-4" href={resolve('/')} onclick={closeMenu}>
				<ChartNoAxesCombined /> Dashboard
			</a>
		</li>
		<li class="rounded-lg p-2">
			<a class="flex items-center gap-4" href={resolve('/relatorio')} onclick={closeMenu}>
				<FileText /> Relatório
			</a>
		</li>
		<li class="rounded-lg p-2">
			<a class="flex items-center gap-4" href={resolve('/automacao')} onclick={closeMenu}>
				<Settings /> Automação
			</a>
		</li>
	</ul>

	<img src="/img/logo-slogan.webp" alt="Logomarca Ousaria" class="w-44 object-contain 2xl:w-50" />
</nav>
