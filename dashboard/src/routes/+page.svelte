<script>
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import TrendingDown from '@lucide/svelte/icons/trending-down';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import { dashboardKpis, healthTrendData, impactData, retentionData } from '$lib/data/voo';

	const formatDelta = (kpi) => {
		const signal = kpi.delta > 0 ? '+' : kpi.delta < 0 ? '−' : '';
		return `${signal}${Math.abs(kpi.delta)} ${kpi.deltaUnit} vs. mês anterior`;
	};
</script>

<svelte:head>
	<title>Dashboard | Comunidade Voo</title>
	<meta name="description" content="Visão geral dos indicadores da Comunidade Voo." />
</svelte:head>

<div class="space-y-6">
	<section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
		{#each dashboardKpis as kpi (kpi.label)}
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

	<section class="grid grid-cols-1 gap-4 lg:grid-cols-5 2xl:grid-cols-7">
		<article
			class="rounded-xl border border-primary/10 bg-white p-4 shadow-sm lg:col-span-2 2xl:col-span-2"
		>
			<div class="mb-2">
				<h2 class="text-base font-bold text-primary">Participação e engajamento</h2>
				<p class="text-xs text-primary/60">Percentual de membros ao longo do período</p>
			</div>
			<LineChart
				data={healthTrendData}
				title="Evolução da participação e do engajamento"
				unit="%"
			/>
		</article>

		<article
			class="rounded-xl border border-primary/10 bg-white p-4 shadow-sm lg:col-span-3 2xl:col-span-3"
		>
			<div class="mb-2">
				<h2 class="text-base font-bold text-primary">Indicadores de impacto</h2>
				<p class="text-xs text-primary/60">Último resultado disponível</p>
			</div>
			<BarChart data={impactData} title="Indicadores de impacto" unit="%" />
		</article>

		<article
			class="rounded-xl border border-primary/10 bg-white p-4 shadow-sm lg:col-span-2 2xl:col-span-2"
		>
			<div class="mb-2">
				<h2 class="text-base font-bold text-primary">Retenção e churn</h2>
				<p class="text-xs text-primary/60">Abril sem dado disponível</p>
			</div>
			<LineChart data={retentionData} title="Evolução mensal de retenção e churn" unit="%" />
		</article>
	</section>
</div>
