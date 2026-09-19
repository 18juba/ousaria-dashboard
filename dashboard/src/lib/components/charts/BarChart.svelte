<script>
	import { Bar } from 'svelte-chartjs';
	import 'chart.js/auto';

	let { data, title = 'Gráfico de barras', unit = '%' } = $props();

	let options = $derived({
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			tooltip: {
				backgroundColor: '#5c0017',
				padding: 12,
				callbacks: {
					label: (context) => ` Resultado: ${context.parsed.y}${unit}`
				}
			}
		},
		scales: {
			x: {
				grid: { display: false },
				ticks: { color: '#8f6b73', font: { family: 'Inter Variable', size: 10 } }
			},
			y: {
				beginAtZero: true,
				max: unit === '%' ? 100 : undefined,
				grid: { color: 'rgba(92, 0, 23, 0.08)' },
				ticks: {
					color: '#8f6b73',
					callback: (value) => `${value}${unit}`,
					font: { family: 'JetBrains Mono Variable', size: 10 }
				}
			}
		}
	});
</script>

<div class="relative h-44 w-full" role="img" aria-label={title}>
	<Bar {data} {options} />
</div>
