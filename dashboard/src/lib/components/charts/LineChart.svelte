<script>
	import { Line } from 'svelte-chartjs';
	import 'chart.js/auto';

	let { data, title = 'Gráfico de linha', unit = '%' } = $props();

	let options = $derived({
		responsive: true,
		maintainAspectRatio: false,
		interaction: { mode: 'index', intersect: false },
		plugins: {
			legend: {
				position: 'bottom',
				labels: {
					color: '#5c0017',
					usePointStyle: true,
					boxWidth: 8,
					padding: 18,
					font: { family: 'Inter Variable' }
				}
			},
			tooltip: {
				backgroundColor: '#5c0017',
				padding: 12,
				callbacks: {
					label: (context) => ` ${context.dataset.label}: ${context.parsed.y}${unit}`
				}
			}
		},
		scales: {
			x: {
				grid: { display: false },
				ticks: { color: '#8f6b73', font: { family: 'Inter Variable' } }
			},
			y: {
				beginAtZero: true,
				max: unit === '%' ? 100 : undefined,
				grid: { color: 'rgba(92, 0, 23, 0.08)' },
				ticks: {
					color: '#8f6b73',
					callback: (value) => `${value}${unit}`,
					font: { family: 'JetBrains Mono Variable' }
				}
			}
		}
	});
</script>

<div class="relative h-72 w-full" role="img" aria-label={title}>
	<Line {data} {options} />
</div>
