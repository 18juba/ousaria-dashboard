const colors = {
	primary: '#5c0017',
	secondary: '#fcb23c',
	tertiary: '#c51e1b',
	muted: '#8f6b73'
};

export const dashboardKpis = [
	{
		label: 'Membros ativos',
		value: '268',
		caption: 'meta: 300'
	},
	{
		label: 'Participação',
		value: '46%',
		caption: 'último mês observado'
	},
	{
		label: 'Engajamento',
		value: '33%',
		caption: 'último mês observado'
	},
	{
		label: 'NPS do encontro',
		value: '51',
		caption: 'última medição'
	}
];

export const healthTrendData = {
	labels: ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
	datasets: [
		{
			label: 'Participação',
			data: [74, 68, 61, 55, 50, 46],
			borderColor: colors.secondary,
			backgroundColor: 'rgba(252, 178, 60, 0.16)',
			pointBackgroundColor: colors.secondary,
			pointBorderColor: '#fffaf5',
			pointBorderWidth: 2,
			pointRadius: 4,
			pointHoverRadius: 6,
			borderWidth: 3,
			tension: 0.35
		},
		{
			label: 'Engajamento',
			data: [61, 56, 49, 43, 38, 33],
			borderColor: colors.tertiary,
			backgroundColor: 'rgba(197, 30, 27, 0.08)',
			pointBackgroundColor: colors.tertiary,
			pointBorderColor: '#fffaf5',
			pointBorderWidth: 2,
			pointRadius: 4,
			pointHoverRadius: 6,
			borderWidth: 3,
			tension: 0.35
		}
	]
};

export const impactData = {
	labels: ['Aprendizado aplicado', 'Receita', 'Conexões de negócio', 'Resposta de impacto'],
	datasets: [
		{
			label: 'Resultado',
			data: [58, 39, 29, 52],
			backgroundColor: [colors.secondary, colors.primary, colors.tertiary, colors.muted],
			borderRadius: 8,
			borderSkipped: false,
			barThickness: 28
		}
	]
};
