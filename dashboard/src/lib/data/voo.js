const colors = {
	primary: '#5c0017',
	secondary: '#fcb23c',
	tertiary: '#c51e1b',
	muted: '#8f6b73'
};

export const monthlyMetrics = [
	{
		month: 'Abril/26',
		shortMonth: 'Abr',
		activeMembers: 180,
		newMembers: 180,
		growthRate: null,
		participationRate: 74,
		engagementRate: 61,
		eventNps: 78,
		surveyResponseRate: 66,
		retentionRate: null,
		churnRate: null
	},
	{
		month: 'Maio/26',
		shortMonth: 'Mai',
		activeMembers: 205,
		newMembers: 28,
		growthRate: 14,
		participationRate: 71,
		engagementRate: 58,
		eventNps: 81,
		surveyResponseRate: 60,
		retentionRate: 96,
		churnRate: 4
	},
	{
		month: 'Junho/26',
		shortMonth: 'Jun',
		activeMembers: 227,
		newMembers: 24,
		growthRate: 11,
		participationRate: 69,
		engagementRate: 55,
		eventNps: 76,
		surveyResponseRate: 57,
		retentionRate: 94,
		churnRate: 6
	},
	{
		month: 'Julho/26',
		shortMonth: 'Jul',
		activeMembers: 246,
		newMembers: 21,
		growthRate: 8,
		participationRate: 62,
		engagementRate: 47,
		eventNps: 69,
		surveyResponseRate: 49,
		retentionRate: 90,
		churnRate: 10
	},
	{
		month: 'Agosto/26',
		shortMonth: 'Ago',
		activeMembers: 261,
		newMembers: 17,
		growthRate: 6,
		participationRate: 54,
		engagementRate: 39,
		eventNps: 58,
		surveyResponseRate: 41,
		retentionRate: 86,
		churnRate: 14
	},
	{
		month: 'Setembro/26',
		shortMonth: 'Set',
		activeMembers: 268,
		newMembers: 9,
		growthRate: 3,
		participationRate: 46,
		engagementRate: 33,
		eventNps: 51,
		surveyResponseRate: 35,
		retentionRate: 83,
		churnRate: 17
	}
];

const currentMonth = monthlyMetrics[monthlyMetrics.length - 1];
const previousMonth = monthlyMetrics[monthlyMetrics.length - 2];

export const dashboardKpis = [
	{
		label: 'Membros ativos',
		value: `${currentMonth.activeMembers}`,
		caption: 'meta: 300'
	},
	{
		label: 'Participação',
		value: `${currentMonth.participationRate}%`,
		caption: 'vs. mês anterior',
		delta: currentMonth.participationRate - previousMonth.participationRate,
		deltaUnit: 'p.p.'
	},
	{
		label: 'Engajamento',
		value: `${currentMonth.engagementRate}%`,
		caption: 'vs. mês anterior',
		delta: currentMonth.engagementRate - previousMonth.engagementRate,
		deltaUnit: 'p.p.'
	},
	{
		label: 'NPS do encontro',
		value: `${currentMonth.eventNps}`,
		caption: 'vs. mês anterior',
		delta: currentMonth.eventNps - previousMonth.eventNps,
		deltaUnit: 'pts'
	}
];

export const healthTrendData = {
	labels: monthlyMetrics.map((metric) => metric.shortMonth),
	datasets: [
		{
			label: 'Participação',
			data: monthlyMetrics.map((metric) => metric.participationRate),
			borderColor: colors.secondary,
			backgroundColor: 'rgba(252, 178, 60, 0.16)',
			pointBackgroundColor: colors.secondary,
			pointBorderColor: '#fffaf5',
			pointBorderWidth: 2,
			pointRadius: 3,
			pointHoverRadius: 5,
			borderWidth: 2.5,
			tension: 0.35
		},
		{
			label: 'Engajamento',
			data: monthlyMetrics.map((metric) => metric.engagementRate),
			borderColor: colors.tertiary,
			backgroundColor: 'rgba(197, 30, 27, 0.08)',
			pointBackgroundColor: colors.tertiary,
			pointBorderColor: '#fffaf5',
			pointBorderWidth: 2,
			pointRadius: 3,
			pointHoverRadius: 5,
			borderWidth: 2.5,
			tension: 0.35
		}
	]
};

export const retentionData = {
	labels: monthlyMetrics.map((metric) => metric.shortMonth),
	datasets: [
		{
			label: 'Retenção',
			data: monthlyMetrics.map((metric) => metric.retentionRate),
			borderColor: colors.primary,
			backgroundColor: 'rgba(92, 0, 23, 0.08)',
			pointBackgroundColor: colors.primary,
			pointBorderColor: '#fffaf5',
			pointBorderWidth: 2,
			pointRadius: 3,
			pointHoverRadius: 5,
			borderWidth: 2.5,
			tension: 0.35,
			spanGaps: false
		},
		{
			label: 'Churn',
			data: monthlyMetrics.map((metric) => metric.churnRate),
			borderColor: colors.tertiary,
			backgroundColor: 'rgba(197, 30, 27, 0.08)',
			pointBackgroundColor: colors.tertiary,
			pointBorderColor: '#fffaf5',
			pointBorderWidth: 2,
			pointRadius: 3,
			pointHoverRadius: 5,
			borderWidth: 2.5,
			tension: 0.35,
			spanGaps: false
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
			barThickness: 22
		}
	]
};
