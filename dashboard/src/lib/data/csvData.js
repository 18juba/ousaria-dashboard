import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';

const colors = {
	primary: '#5c0017',
	secondary: '#fcb23c',
	tertiary: '#c51e1b',
	muted: '#8f6b73'
};

export const DEFAULT_FILES = {
	principal: {
		url: '/data/comunidade_voo-principal.csv',
		fileName: 'comunidade_voo - principal.csv'
	},
	impact: {
		url: '/data/comunidade_voo-pesquisa_impacto.csv',
		fileName: 'comunidade_voo - pesquisa_impacto.csv'
	}
};

const STORAGE_KEY = 'ousaria-dashboard-csv-v1';
const MEMBER_TARGET = 300;

const emptyState = {
	status: 'loading',
	source: 'default',
	error: null,
	loadedAt: null,
	principalFileName: DEFAULT_FILES.principal.fileName,
	impactFileName: DEFAULT_FILES.impact.fileName,
	raw: {
		principal: '',
		impact: ''
	},
	monthlyMetrics: [],
	dashboardKpis: [],
	healthTrendData: { labels: [], datasets: [] },
	growthData: { labels: [], datasets: [] },
	growthRateData: { labels: [], datasets: [] },
	experienceData: { labels: [], datasets: [] },
	retentionData: { labels: [], datasets: [] },
	impactData: { labels: [], datasets: [] },
	memberGoal: { current: null, target: MEMBER_TARGET, achieved: null, remaining: null },
	impactRows: [],
	whatsappThemes: []
};

export const appData = writable(emptyState);

let initializationPromise;

const cleanText = (value = '') =>
	String(value)
		.replace(/^\uFEFF/, '')
		.replace(/\s+/g, ' ')
		.trim();

const normalizeKey = (value = '') =>
	cleanText(value)
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '');

const parseNumber = (value) => {
	const normalized = cleanText(value);
	if (!normalized || normalized === '-') return null;

	const numericValue = Number(normalized.replace('%', '').replace(',', '.'));
	return Number.isFinite(numericValue) ? numericValue : null;
};

const parsePercentage = (value) => parseNumber(value);

const isPercentageValue = (value) => cleanText(value).includes('%');

export function parseCsv(text = '') {
	const rows = [];
	let row = [];
	let field = '';
	let insideQuotes = false;
	const input = String(text).replace(/^\uFEFF/, '');

	for (let index = 0; index < input.length; index += 1) {
		const character = input[index];
		const nextCharacter = input[index + 1];

		if (character === '"') {
			if (insideQuotes && nextCharacter === '"') {
				field += '"';
				index += 1;
			} else {
				insideQuotes = !insideQuotes;
			}
		} else if (character === ',' && !insideQuotes) {
			row.push(field);
			field = '';
		} else if ((character === '\n' || character === '\r') && !insideQuotes) {
			if (character === '\r' && nextCharacter === '\n') index += 1;
			row.push(field);
			field = '';
			if (row.some((cell) => cleanText(cell) !== '')) rows.push(row);
			row = [];
		} else {
			field += character;
		}
	}

	if (field.length > 0 || row.length > 0) {
		row.push(field);
		if (row.some((cell) => cleanText(cell) !== '')) rows.push(row);
	}

	const headers = rows.shift()?.map(normalizeKey) ?? [];

	return rows.map((cells) =>
		Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']))
	);
}

const shortMonth = (month) => {
	const monthName = normalizeKey(month).split('_')[0];
	const labels = {
		abril: 'Abr',
		maio: 'Mai',
		junho: 'Jun',
		julho: 'Jul',
		agosto: 'Ago',
		setembro: 'Set',
		outubro: 'Out',
		novembro: 'Nov',
		dezembro: 'Dez'
	};

	return labels[monthName] ?? cleanText(month).slice(0, 3);
};

function parsePrincipalCsv(text) {
	const rows = parseCsv(text);

	if (!rows.length) {
		throw new Error('O CSV principal não possui linhas de dados.');
	}

	return rows.map((row) => ({
		month: cleanText(row.mes),
		shortMonth: shortMonth(row.mes),
		activeMembers: parseNumber(row.membros_ativos),
		newMembers: parseNumber(row.novos_membros),
		growthRate: parsePercentage(row.crescimento_mensal),
		participationRate: parsePercentage(row.participacao_encontro),
		engagementRate: parsePercentage(row.engajamento_mensal),
		eventNps: parseNumber(row.nps),
		surveyResponseRate: parsePercentage(row.resposta_pesquisa_mensal),
		retentionRate: parsePercentage(row.retencao_mensal),
		churnRate: parsePercentage(row.churn_mensal),
		theme: cleanText(row.tema_mais_recorrente)
	}));
}

const classifyImpact = (indicator) => {
	const normalized = normalizeKey(indicator);

	if (normalized.includes('aplicou')) return 'learning';
	if (normalized.includes('faturamento')) return 'revenue';
	if (normalized.includes('conexao')) return 'connections';
	if (normalized.includes('nps')) return 'nps';
	if (normalized.includes('autonomia')) return 'autonomy';
	if (normalized.includes('resposta')) return 'response';
	return normalized;
};

const impactLabel = (key) => {
	const labels = {
		learning: ['Aprendizado', 'aplicado'],
		revenue: ['Aumento de', 'faturamento'],
		connections: ['Conexão de', 'negócio'],
		nps: ['NPS geral', 'da comunidade'],
		autonomy: ['Autonomia', 'empreendedora'],
		response: ['Resposta à', 'pesquisa']
	};

	return labels[key] ?? [key];
};

function parseImpactCsv(text) {
	const rows = parseCsv(text);

	if (!rows.length) {
		throw new Error('O CSV de pesquisa de impacto não possui linhas de dados.');
	}

	return rows.map((row) => {
		const indicator = cleanText(row.indicador);
		const waveOneRaw = cleanText(row.onda_1_abril_26);
		const waveTwoRaw = cleanText(row.onda_2_setembro_26);
		const key = classifyImpact(indicator);

		return {
			key,
			indicator,
			label: impactLabel(key),
			category: key === 'response' ? 'evidence' : 'outcome',
			waveOne: parseNumber(waveOneRaw),
			waveTwo: parseNumber(waveTwoRaw),
			isPercentage: isPercentageValue(waveOneRaw) || isPercentageValue(waveTwoRaw),
			unit:
				isPercentageValue(waveOneRaw) || isPercentageValue(waveTwoRaw)
					? '%'
					: key === 'nps'
						? 'pts'
						: key === 'autonomy'
							? '0–10'
							: ''
		};
	});
}

const createLineDataset = (
	label,
	data,
	borderColor,
	backgroundColor,
	spanGaps = false,
	extras = {}
) => ({
	label,
	data,
	borderColor,
	backgroundColor,
	pointBackgroundColor: borderColor,
	pointBorderColor: '#fffaf5',
	pointBorderWidth: 2,
	pointRadius: 3,
	pointHoverRadius: 5,
	borderWidth: 2.5,
	tension: 0.35,
	spanGaps,
	...extras
});

const createChartData = (monthlyMetrics) => {
	const labels = monthlyMetrics.map((metric) => metric.shortMonth);

	return {
		labels,
		healthTrendData: {
			labels,
			datasets: [
				createLineDataset(
					'Participação',
					monthlyMetrics.map((metric) => metric.participationRate),
					colors.secondary,
					'rgba(252, 178, 60, 0.16)'
				),
				createLineDataset(
					'Engajamento',
					monthlyMetrics.map((metric) => metric.engagementRate),
					colors.tertiary,
					'rgba(197, 30, 27, 0.08)'
				)
			]
		},
		growthData: {
			labels,
			datasets: [
				createLineDataset(
					'Membros ativos',
					monthlyMetrics.map((metric) => metric.activeMembers),
					colors.primary,
					'rgba(92, 0, 23, 0.08)'
				),
				createLineDataset(
					'Novos membros',
					monthlyMetrics.map((metric) => metric.newMembers),
					colors.secondary,
					'rgba(252, 178, 60, 0.12)'
				),
				createLineDataset(
					'Meta de membros (300)',
					monthlyMetrics.map(() => MEMBER_TARGET),
					colors.muted,
					'transparent',
					false,
					{
						borderDash: [6, 5],
						borderWidth: 1.5,
						pointRadius: 0,
						pointHoverRadius: 0
					}
				)
			]
		},
		growthRateData: {
			labels,
			datasets: [
				createLineDataset(
					'Crescimento mensal',
					monthlyMetrics.map((metric) => metric.growthRate),
					colors.tertiary,
					'rgba(197, 30, 27, 0.08)'
				)
			]
		},
		experienceData: {
			labels,
			datasets: [
				createLineDataset(
					'NPS do encontro (pts)',
					monthlyMetrics.map((metric) => metric.eventNps),
					colors.primary,
					'rgba(92, 0, 23, 0.08)'
				),
				createLineDataset(
					'Resposta à pesquisa (%)',
					monthlyMetrics.map((metric) => metric.surveyResponseRate),
					colors.secondary,
					'rgba(252, 178, 60, 0.12)'
				)
			]
		},
		retentionData: {
			labels,
			datasets: [
				createLineDataset(
					'Retenção',
					monthlyMetrics.map((metric) => metric.retentionRate),
					colors.primary,
					'rgba(92, 0, 23, 0.08)'
				),
				createLineDataset(
					'Churn',
					monthlyMetrics.map((metric) => metric.churnRate),
					colors.tertiary,
					'rgba(197, 30, 27, 0.08)'
				)
			]
		}
	};
};

const createImpactChartData = (impactRows) => {
	const rows = impactRows.filter(
		(row) =>
			row.category === 'outcome' && row.isPercentage && row.waveOne !== null && row.waveTwo !== null
	);

	return {
		labels: rows.map((row) => row.label),
		datasets: [
			{
				label: 'Onda 1 — Abril/26',
				data: rows.map((row) => row.waveOne),
				backgroundColor: colors.secondary,
				borderColor: colors.secondary,
				borderWidth: 1,
				barPercentage: 0.65,
				categoryPercentage: 0.78,
				borderRadius: 8,
				borderSkipped: false,
				maxBarThickness: 18
			},
			{
				label: 'Onda 2 — Setembro/26',
				data: rows.map((row) => row.waveTwo),
				backgroundColor: colors.primary,
				borderColor: colors.primary,
				borderWidth: 1,
				barPercentage: 0.65,
				categoryPercentage: 0.78,
				borderRadius: 8,
				borderSkipped: false,
				maxBarThickness: 18
			}
		]
	};
};

const buildModel = (principalText, impactText, metadata = {}) => {
	const monthlyMetrics = parsePrincipalCsv(principalText);
	const impactRows = parseImpactCsv(impactText);
	const currentMonth = monthlyMetrics[monthlyMetrics.length - 1];
	const previousMonth = monthlyMetrics[monthlyMetrics.length - 2];
	const charts = createChartData(monthlyMetrics);
	const impactData = createImpactChartData(impactRows);
	const currentMembers = currentMonth.activeMembers ?? null;
	const monthlyDelta = (field) => {
		const current = currentMonth[field];
		const previous = previousMonth?.[field];
		return current === null || current === undefined || previous === null || previous === undefined
			? undefined
			: current - previous;
	};
	const memberGoal = {
		current: currentMembers,
		target: MEMBER_TARGET,
		achieved: currentMembers === null ? null : Math.round((currentMembers / MEMBER_TARGET) * 100),
		remaining: currentMembers === null ? null : Math.max(MEMBER_TARGET - currentMembers, 0)
	};
	const dashboardKpis = [
		{
			label: 'Membros ativos',
			value: String(currentMonth.activeMembers ?? '—'),
			caption: 'meta: 300',
			goal: memberGoal
		},
		{
			label: 'Participação',
			value: currentMonth.participationRate === null ? '—' : currentMonth.participationRate + '%',
			caption: 'vs. mês anterior',
			delta: monthlyDelta('participationRate'),
			deltaUnit: 'p.p.'
		},
		{
			label: 'Engajamento',
			value: currentMonth.engagementRate === null ? '—' : currentMonth.engagementRate + '%',
			caption: 'vs. mês anterior',
			delta: monthlyDelta('engagementRate'),
			deltaUnit: 'p.p.'
		},
		{
			label: 'NPS do encontro',
			value: currentMonth.eventNps === null ? '—' : String(currentMonth.eventNps),
			caption: 'vs. mês anterior',
			delta: monthlyDelta('eventNps'),
			deltaUnit: 'pts'
		},
		{
			label: 'Resposta à pesquisa',
			value: currentMonth.surveyResponseRate === null ? '—' : currentMonth.surveyResponseRate + '%',
			caption: 'vs. mês anterior',
			delta: monthlyDelta('surveyResponseRate'),
			deltaUnit: 'p.p.'
		}
	];

	return {
		...metadata,
		status: 'ready',
		error: null,
		loadedAt: metadata.loadedAt ?? new Date().toISOString(),
		monthlyMetrics,
		dashboardKpis,
		memberGoal,
		healthTrendData: charts.healthTrendData,
		growthData: charts.growthData,
		growthRateData: charts.growthRateData,
		experienceData: charts.experienceData,
		retentionData: charts.retentionData,
		impactData,
		impactRows,
		whatsappThemes: monthlyMetrics
			.filter((metric) => metric.month && metric.theme)
			.map((metric) => ({ month: metric.month, theme: metric.theme }))
	};
};

const setError = (error) => {
	appData.update((state) => ({
		...state,
		status: 'error',
		error: error instanceof Error ? error.message : 'Não foi possível carregar os CSVs.'
	}));
};

const readDefaultFiles = async () => {
	const responses = await Promise.all([
		fetch(DEFAULT_FILES.principal.url),
		fetch(DEFAULT_FILES.impact.url)
	]);

	if (responses.some((response) => !response.ok)) {
		throw new Error('Os arquivos CSV padrão não foram encontrados na aplicação.');
	}

	return Promise.all(responses.map((response) => response.text()));
};

export async function initializeData() {
	if (!browser) return null;
	if (initializationPromise) return initializationPromise;

	initializationPromise = (async () => {
		appData.update((state) => ({ ...state, status: 'loading', error: null }));

		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const saved = JSON.parse(stored);
				const model = buildModel(saved.raw.principal, saved.raw.impact, {
					source: 'imported',
					principalFileName: saved.principalFileName ?? DEFAULT_FILES.principal.fileName,
					impactFileName: saved.impactFileName ?? DEFAULT_FILES.impact.fileName,
					raw: saved.raw,
					loadedAt: saved.loadedAt
				});
				appData.set(model);
				return model;
			} catch {
				localStorage.removeItem(STORAGE_KEY);
			}
		}

		const [principal, impact] = await readDefaultFiles();
		const model = buildModel(principal, impact, {
			source: 'default',
			principalFileName: DEFAULT_FILES.principal.fileName,
			impactFileName: DEFAULT_FILES.impact.fileName,
			raw: { principal, impact }
		});
		appData.set(model);
		return model;
	})().catch((error) => {
		setError(error);
		return null;
	});

	return initializationPromise;
}

export function importCsvPair({ principalText, impactText, principalFileName, impactFileName }) {
	if (!browser) return null;

	const currentState = get(appData);
	const nextPrincipalText = principalText ?? currentState.raw.principal;
	const nextImpactText = impactText ?? currentState.raw.impact;

	if (!nextPrincipalText || !nextImpactText) {
		throw new Error('É necessário ter pelo menos um CSV válido carregado na aplicação.');
	}

	const nextPrincipalFileName =
		principalFileName ?? currentState.principalFileName ?? DEFAULT_FILES.principal.fileName;
	const nextImpactFileName =
		impactFileName ?? currentState.impactFileName ?? DEFAULT_FILES.impact.fileName;
	const savedAt = new Date().toISOString();
	const model = buildModel(nextPrincipalText, nextImpactText, {
		source: 'imported',
		principalFileName: nextPrincipalFileName,
		impactFileName: nextImpactFileName,
		raw: { principal: nextPrincipalText, impact: nextImpactText },
		loadedAt: savedAt
	});

	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			raw: { principal: nextPrincipalText, impact: nextImpactText },
			principalFileName: nextPrincipalFileName,
			impactFileName: nextImpactFileName,
			loadedAt: savedAt
		})
	);
	appData.set(model);
	return model;
}

export async function resetToDefaults() {
	if (!browser) return null;

	localStorage.removeItem(STORAGE_KEY);
	const [principal, impact] = await readDefaultFiles();
	const model = buildModel(principal, impact, {
		source: 'default',
		principalFileName: DEFAULT_FILES.principal.fileName,
		impactFileName: DEFAULT_FILES.impact.fileName,
		raw: { principal, impact }
	});
	appData.set(model);
	return model;
}

export function downloadCsv(content, fileName) {
	if (!browser || !content) return;

	const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = fileName;
	anchor.click();
	URL.revokeObjectURL(url);
}
