<script>
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import ChartNoAxesCombined from '@lucide/svelte/icons/chart-no-axes-combined';
	import FileText from '@lucide/svelte/icons/file-text';
	import Menu from '@lucide/svelte/icons/menu';
	import Settings from '@lucide/svelte/icons/settings';
	import X from '@lucide/svelte/icons/x';

	const dashboardHref = resolve('/');
	const reportHref = resolve('/relatorio');
	const automationHref = resolve('/automacao');
	const currentPath = $derived(page.url.pathname);

	const isActive = (href) => currentPath === href;

	const linkClasses = (href) =>
		'group relative flex items-center gap-4 overflow-hidden rounded-lg p-2 transition-transform duration-200 ease-out hover:translate-x-0.5 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none ' +
		(isActive(href) ? 'font-semibold' : '');

	const highlightClasses = (href) =>
		'pointer-events-none absolute inset-0 bg-linear-to-r from-white/20 via-white/10 to-white/5 transition-opacity duration-300 ease-out ' +
		(isActive(href)
			? 'opacity-100'
			: 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100');

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
	class={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col justify-between bg-primary px-6 py-18 shadow-2xl transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-50 lg:max-w-none lg:translate-x-0 lg:bg-transparent lg:px-0 lg:py-8 lg:shadow-none 2xl:w-60 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
>
	<ul class="flex flex-col gap-4 font-bold text-white 2xl:text-lg">
		<li>
			<a
				class={linkClasses(dashboardHref)}
				href={dashboardHref}
				aria-current={isActive(dashboardHref) ? 'page' : undefined}
				onclick={closeMenu}
			>
				<span class={highlightClasses(dashboardHref)} aria-hidden="true"></span>
				<span class="relative flex items-center gap-4">
					<ChartNoAxesCombined class="transition-transform duration-200 group-hover:scale-105" />
					Dashboard
				</span>
			</a>
		</li>
		<li>
			<a
				class={linkClasses(reportHref)}
				href={reportHref}
				aria-current={isActive(reportHref) ? 'page' : undefined}
				onclick={closeMenu}
			>
				<span class={highlightClasses(reportHref)} aria-hidden="true"></span>
				<span class="relative flex items-center gap-4">
					<FileText class="transition-transform duration-200 group-hover:scale-105" />
					Relatório
				</span>
			</a>
		</li>
		<li>
			<a
				class={linkClasses(automationHref)}
				href={automationHref}
				aria-current={isActive(automationHref) ? 'page' : undefined}
				onclick={closeMenu}
			>
				<span class={highlightClasses(automationHref)} aria-hidden="true"></span>
				<span class="relative flex items-center gap-4">
					<Settings class="transition-transform duration-200 group-hover:scale-105" />
					Automação
				</span>
			</a>
		</li>
	</ul>

	<img
		src="/img/logo-slogan.webp"
		alt="Logomarca Ousaria"
		class="w-44 self-center object-contain 2xl:w-50"
	/>
</nav>
