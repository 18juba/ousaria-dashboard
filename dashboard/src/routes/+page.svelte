<script>
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import TrendingDown from '@lucide/svelte/icons/trending-down';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import { appData } from '$lib/data/csvData';

	const formatDelta = (kpi) => {
		const signal = kpi.delta > 0 ? '+' : kpi.delta < 0 ? '−' : '';
		return `${signal}${Math.abs(kpi.delta)} ${kpi.deltaUnit} vs. mês anterior`;
	};

	let data = $derived($appData);
</script>

<svelte:head>
	<title>Dashboard | Comunidade Voo</title>
	<meta name="description" content="Visão geral dos indicadores da Comunidade Voo." />
</svelte:head>

<div class="space-y-6">
	{#if data.status === 'loading'}
		<div class="rounded-xl border border-primary/10 bg-white p-6 text-sm text-primary/65 shadow-sm">
			Carregando os dados
		</div>
	{:else if data.status === 'error'}
		<div class="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800 shadow-sm">
			<p class="font-bold">Não foi possível carregar os dados.</p>
			<p class="mt-1">{data.error}</p>
		</div>
	{:else}
		<section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{#each data.dashboardKpis as kpi (kpi.label)}
				<article class="rounded-xl border border-primary/10 bg-white p-4 shadow-sm">
					<p class="text-sm font-semibold text-primary/65">{kpi.label}</p>
					<p class="mt-2 font-mono text-3xl font-bold text-primary">{kpi.value}</p>
					{#if kpi.delta !== undefined}
						<div
							class={`mt-1 flex items-center gap-1.5 text-xs font-semibold ${kpi.delta < 0 ? 'text-rose-600' : 'text-emerald-600'}`}
						>
							<span
								class={`inline-flex rounded-full p-0.5 ${kpi.delta < 0 ? 'bg-rose-50' : 'bg-emerald-50'}`}
							>
								{#if kpi.delta < 0}
									<TrendingDown size={14} strokeWidth={2.5} />
								{:else}
									<TrendingUp size={14} strokeWidth={2.5} />
								{/if}
							</span>
							<span>{formatDelta(kpi)}</span>
						</div>
					{:else}
						<p class="mt-1 text-xs text-primary/55">{kpi.caption}</p>
					{/if}
				</article>
			{/each}
		</section>

		<section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<article class="rounded-xl border border-primary/10 bg-white p-4 shadow-sm">
				<div class="mb-2">
					<h2 class="text-base font-bold text-primary">Crescimento da base</h2>
					<p class="text-xs text-primary/60">Membros ativos e novos membros</p>
				</div>
				<LineChart data={data.growthData} title="Crescimento mensal da base" unit="" />
			</article>

			<article class="rounded-xl border border-primary/10 bg-white p-4 shadow-sm">
				<div class="mb-2">
					<h2 class="text-base font-bold text-primary">Participação e engajamento</h2>
					<p class="text-xs text-primary/60">Percentual de membros ao longo do período</p>
				</div>
				<LineChart
					data={data.healthTrendData}
					title="Evolução da participação e do engajamento"
					unit="%"
				/>
			</article>

			<article class="rounded-xl border border-primary/10 bg-white p-4 shadow-sm">
				<div class="mb-2">
					<h2 class="text-base font-bold text-primary">Retenção e churn</h2>
					<p class="text-xs text-primary/60">Abril sem dado disponível</p>
				</div>
				<LineChart data={data.retentionData} title="Evolução mensal de retenção e churn" unit="%" />
			</article>
		</section>

		<section class="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-7">
			<article
				class="h-full rounded-xl border border-primary/10 bg-white p-5 shadow-sm lg:col-span-3"
			>
				<div class="mb-2">
					<h2 class="text-lg font-bold text-primary">Indicadores de impacto</h2>
					<p class="text-xs text-primary/60">Comparação entre ondas</p>
				</div>
				<BarChart data={data.impactData} title="Indicadores de impacto" unit="%" />
			</article>

			<article
				class="flex h-full flex-col rounded-xl border border-primary/10 bg-white p-5 shadow-sm lg:col-span-4"
			>
				<h2 class="mb-3 text-lg font-bold text-primary">Temas recorrentes no WhatsApp</h2>

				<div class="min-h-0 flex-1 overflow-y-auto rounded-lg border border-primary/10">
					<table class="w-full border-collapse text-left text-xs">
						<tbody>
							{#each data.whatsappThemes as item (item.month)}
								<tr class="border-t border-primary/10 align-top">
									<td
										class="px-3 py-3 font-mono text-[11px] font-semibold whitespace-nowrap text-primary"
									>
										{item.month}
									</td>
									<td class="px-3 py-3 leading-5 text-primary/75">{item.theme}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</article>
		</section>
	{/if}
</div>
