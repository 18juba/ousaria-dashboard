<script>
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import { dashboardKpis, healthTrendData, impactData } from '$lib/data/voo';
</script>

<svelte:head>
	<title>Dashboard | Comunidade Voo</title>
	<meta name="description" content="Visão geral dos indicadores da Comunidade Voo." />
</svelte:head>

<div class="space-y-6">
	<section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
		{#each dashboardKpis as kpi (kpi.label)}
			<article class="rounded-xl border border-primary/10 bg-white p-5 shadow-sm">
				<p class="text-sm font-semibold text-primary/65">{kpi.label}</p>
				<p class="mt-3 font-mono text-4xl font-bold text-primary">{kpi.value}</p>
				<p class="mt-2 text-xs text-primary/55">{kpi.caption}</p>
			</article>
		{/each}
	</section>

	<section class="grid grid-cols-1 gap-6 2xl:grid-cols-5">
		<article class="rounded-xl border border-primary/10 bg-white p-5 shadow-sm 2xl:col-span-3">
			<div class="mb-4">
				<h2 class="text-lg font-bold text-primary">Participação e engajamento</h2>
				<p class="text-sm text-primary/60">Percentual de membros ao longo do período</p>
			</div>
			<LineChart
				data={healthTrendData}
				title="Evolução da participação e do engajamento"
				unit="%"
			/>
		</article>

		<article class="rounded-xl border border-primary/10 bg-white p-5 shadow-sm 2xl:col-span-2">
			<div class="mb-4">
				<h2 class="text-lg font-bold text-primary">Indicadores de impacto</h2>
				<p class="text-sm text-primary/60">Último resultado disponível</p>
			</div>
			<BarChart data={impactData} title="Indicadores de impacto" unit="%" />
		</article>
	</section>
</div>
