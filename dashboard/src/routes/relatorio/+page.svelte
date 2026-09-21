<script>
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import TrendingDown from '@lucide/svelte/icons/trending-down';
	import { appData } from '$lib/data/csvData';

	let data = $derived($appData);
	let monthlyMetrics = $derived(data.monthlyMetrics);
	let firstMonth = $derived(monthlyMetrics[0] ?? {});
	let firstComparableMonth = $derived(monthlyMetrics[1] ?? {});
	let currentMonth = $derived(monthlyMetrics[monthlyMetrics.length - 1] ?? {});

	const formatSigned = (value) => (value > 0 ? '+' : value < 0 ? '−' : '') + Math.abs(value);

	let totalMemberGrowth = $derived(
		(currentMonth.activeMembers ?? 0) - (firstMonth.activeMembers ?? 0)
	);
	let totalMemberGrowthRate = $derived(
		firstMonth.activeMembers ? Math.round((totalMemberGrowth / firstMonth.activeMembers) * 100) : 0
	);
	let newMembersChangeRate = $derived(
		firstComparableMonth.newMembers
			? Math.round(
					((currentMonth.newMembers - firstComparableMonth.newMembers) /
						firstComparableMonth.newMembers) *
						100
				)
			: 0
	);
	let participationDelta = $derived(
		(currentMonth.participationRate ?? 0) - (firstMonth.participationRate ?? 0)
	);
	let engagementDelta = $derived(
		(currentMonth.engagementRate ?? 0) - (firstMonth.engagementRate ?? 0)
	);

	let impactRows = $derived(data.impactRows);

	const impactValue = (key, wave) => {
		const row = impactRows.find((item) => item.key === key);
		return row?.[wave] ?? '—';
	};

	const formatImpactValue = (row, value) => {
		if (value === null || value === undefined) return '—';
		if (row.unit === '%') return `${value}%`;
		if (row.unit === 'pts') return `${value} pts`;
		return `${String(value).replace('.', ',')}/10`;
	};

	const themeReadings = [
		{
			reading:
				'O grupo ainda precisava de orientação básica para ser usado como espaço de comunidade.'
		},
		{
			reading:
				'A demanda por precificação e fluxo de caixa mostra interesse quando o conteúdo resolve problemas concretos.'
		},
		{
			reading:
				'A busca por fornecedores e parceiros revela uma oportunidade de ativar valor entre os próprios membros.'
		},
		{
			reading:
				'O horário fixo aparece como uma possível barreira de acesso; a relação com a presença precisa ser testada.'
		},
		{
			reading:
				'A percepção de repetição pode indicar perda de novidade antes de a base atingir a meta de 300 membros.'
		},
		{
			reading:
				'A predominância de respostas a lembretes sugere menor espontaneidade, mas não prova sozinha falta de interesse.'
		}
	];

	const formatThemeContext = (metric) =>
		[
			metric?.participationRate !== null && metric?.participationRate !== undefined
				? `${metric.participationRate}% de participação`
				: null,
			metric?.engagementRate !== null && metric?.engagementRate !== undefined
				? `${metric.engagementRate}% de engajamento`
				: null,
			metric?.eventNps !== null && metric?.eventNps !== undefined ? `NPS ${metric.eventNps}` : null,
			metric?.newMembers !== null && metric?.newMembers !== undefined
				? `${metric.newMembers} novos membros`
				: null
		]
			.filter(Boolean)
			.join(' · ');

	let themeAnalysis = $derived.by(() =>
		data.whatsappThemes
			.map((theme, index) => ({
				...theme,
				...(themeReadings[index] ?? {}),
				context: formatThemeContext(monthlyMetrics[index])
			}))
			.filter((item) => item.month)
	);

	let actionPlan = $derived([
		{
			priority: '01',
			title: 'Reativar a conversa orgânica',
			signal: 'Em setembro, a maior parte das interações já era resposta a lembretes.',
			experiment:
				'Reduzir mensagens automáticas, criar uma enquete diária, destacar conquistas dos membros e estabelecer mediação ativa no grupo.',
			measure: 'Mensagens espontâneas por semana e participação mensal.'
		},
		{
			priority: '02',
			title: 'Revisar o ritual e o acesso',
			signal:
				'A reclamação sobre terça-feira às 19h aparece no mesmo período em que a participação cai de 69% para 62%.',
			hypothesis:
				'Uma hipótese é que o horário fixo reduz o acesso de parte dos membros; os dados não comprovam causalidade.',
			experiment:
				'Aplicar uma enquete de horários, testar um segundo turno ou encontro alternativo e disponibilizar resumo acionável para quem não puder participar.',
			measure: 'Participação, resposta à pesquisa e presença por horário.'
		},
		{
			priority: '03',
			title: 'Voltar ao conteúdo que resolve',
			signal:
				'Precificação e fluxo de caixa geraram dúvidas; depois, os encontros passaram a ser percebidos como repetitivos.',
			hypothesis:
				'Uma hipótese é que a perda de relevância percebida contribui para a queda de engajamento e NPS.',
			experiment:
				'Incluir precificação e fluxo de caixa nos encontros mensais, com aulas sobre fundamentos, exemplos práticos e espaço para debate; variar a abordagem ao longo do mês.',
			measure: 'Engajamento, NPS do encontro e avaliação de utilidade.'
		},
		{
			priority: '04',
			title: 'Fazer o networking acontecer',
			signal:
				'A conexão de negócios caiu de ' +
				impactValue('connections', 'waveOne') +
				'% na Onda 1 para ' +
				impactValue('connections', 'waveTwo') +
				'% na Onda 2.',
			hypothesis:
				'Uma hipótese é que a comunidade não está convertendo sua base em interações de negócio com clareza suficiente.',
			experiment:
				'Organizar uma rodada de pedidos e ofertas, curar apresentações entre membros e acompanhar se as indicações viraram conversas ou parcerias.',
			measure: 'Introduções realizadas e conexões de negócio geradas.'
		},
		{
			priority: '05',
			title: 'Retomar crescimento por indicação',
			signal:
				'A entrada mensal caiu de ' +
				firstComparableMonth.newMembers +
				' novos membros em ' +
				firstComparableMonth.month +
				' para ' +
				currentMonth.newMembers +
				' em ' +
				currentMonth.month +
				'.',
			experiment:
				'Ativar membros satisfeitos como embaixadores, usar histórias de resultado e convidar perfis que complementem as necessidades atuais da rede.',
			measure: 'Melhora do crescimento mensal.'
		}
	]);
</script>

<svelte:head>
	<title>Relatório | Comunidade Voo</title>
	<meta
		name="description"
		content="Avaliação aprofundada dos dados e plano de recuperação da Comunidade Voo."
	/>
</svelte:head>

{#if data.status === 'loading'}
	<div class="rounded-xl border border-primary/10 bg-white p-6 text-sm text-primary/65 shadow-sm">
		Carregando o relatório
	</div>
{:else if data.status === 'error'}
	<div class="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800 shadow-sm">
		<p class="font-bold">Não foi possível carregar o relatório.</p>
		<p class="mt-1">{data.error}</p>
	</div>
{:else}
	<div class="space-y-6 pb-8">
		<section class="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm md:p-8">
			<div class="max-w-3xl">
				<h1 class="text-3xl leading-tight font-bold text-primary md:text-4xl">
					Renovação de contrato, mas com um plano claro de recuperação
				</h1>
				<p class="mt-4 max-w-2xl text-sm leading-6 text-primary/70 md:text-base">
					A comunidade ainda cresceu em tamanho, mas perdeu força na participação, no engajamento e
					na geração de valor entre membros. A recomendação é apoiar a renovação com um ciclo de
					recuperação de 90 dias, metas explícitas e revisão mensal.
				</p>
			</div>

			<div class="mt-8 grid gap-4 lg:grid-cols-2">
				<div class="rounded-xl bg-primary p-5 text-white">
					<div class="flex items-center gap-2 text-secondary">
						<CircleAlert size={18} />
						<p class="text-xs font-bold tracking-[0.12em] uppercase">Leitura de trabalho</p>
					</div>
					<p class="mt-3 text-lg font-bold">
						Os sinais apontam para três frentes a testar: acesso aos encontros, relevância dos
						conteúdos e geração de conexões de negócio.
					</p>
				</div>
				<div class="rounded-xl border border-secondary/30 bg-secondary/10 p-5 text-primary">
					<p class="text-xs font-bold tracking-[0.12em] text-primary/55 uppercase">
						Fato observado
					</p>
					<p class="mt-3 text-lg font-bold">
						A base cresceu, mas os indicadores de participação, engajamento, NPS, resposta e
						retenção pioraram enquanto o churn aumentou.
					</p>
				</div>
			</div>
		</section>

		<section class="grid gap-4 xl:grid-cols-6">
			<article class="rounded-xl border border-primary/10 bg-white p-6 shadow-sm xl:col-span-3">
				<div class="flex items-center gap-2">
					<TrendingDown class="text-rose-700" size={19} />
					<h2 class="text-xl font-bold text-primary">Diagnóstico gerencial</h2>
				</div>
				<div class="mt-5 space-y-4 text-sm leading-6 text-primary/75">
					<p>
						A base passou de <strong class="text-primary">{firstMonth.activeMembers}</strong> para
						<strong class="text-primary">{currentMonth.activeMembers} membros</strong>, um avanço de
						<strong class="text-primary">{totalMemberGrowthRate}%</strong>. O crescimento da base
						demonstra tração, mas não é suficiente, isoladamente, para avaliar o sucesso da
						comunidade. Minha recomendação seria discutir a renovação acompanhada de um plano de
						recuperação e metas claras de saúde da comunidade.
					</p>
					<p>
						O alerta está na velocidade e na qualidade desse crescimento. A entrada mensal caiu
						<strong class="text-rose-700"
							>{firstComparableMonth.newMembers} para {currentMonth.newMembers} novos membros</strong
						>
						({formatSigned(newMembersChangeRate)}%), enquanto o crescimento mensal recuou para
						<strong class="text-rose-700">{currentMonth.growthRate}%</strong>. Ao mesmo tempo,
						participação e engajamento perderam
						<strong class="text-rose-700">{Math.abs(participationDelta)} p.p.</strong>
						e
						<strong class="text-rose-700">{Math.abs(engagementDelta)} p.p.</strong>,
						respectivamente. O NPS do encontro caiu de
						<strong class="text-rose-700">{firstMonth.eventNps}</strong> para
						<strong class="text-rose-700">{currentMonth.eventNps}</strong> e a resposta mensal de
						<strong class="text-rose-700">{firstMonth.surveyResponseRate}%</strong> para
						<strong class="text-rose-700">{currentMonth.surveyResponseRate}%</strong>.
					</p>
					<p>
						A retenção caiu para {currentMonth.retentionRate}% e o churn subiu para {currentMonth.churnRate}%.
						Ou seja: antes de investir apenas em trazer mais pessoas, a gestão precisa recuperar o
						hábito de participação de quem já está dentro.
					</p>
				</div>
			</article>

			<article class="rounded-xl border border-primary/10 bg-white p-6 shadow-sm xl:col-span-3">
				<div class="flex items-center gap-2">
					<MessageCircle class="text-green-500" size={19} />
					<h2 class="text-xl font-bold text-primary">O que mostra o WhatsApp</h2>
				</div>
				<p class="mt-2 text-sm leading-5 text-primary/60">
					Os temas recorrentes foram cruzados com os indicadores mensais; eles sugerem caminhos de
					investigação, mas não provam causalidade.
				</p>

				<div class="mt-5 max-h-60 space-y-4 overflow-y-auto pr-1">
					{#each themeAnalysis as item (item.month)}
						<div class="border-b border-primary/10 pb-4 last:border-0 last:pb-0">
							<span class="font-mono text-[11px] font-bold text-primary">{item.month}</span>
							<p class="mt-2 text-xs leading-5 font-semibold text-primary/80">{item.theme}</p>
							<p class="mt-1 text-xs leading-5 text-primary/55">{item.reading}</p>
							{#if item.context}
								<p class="mt-1 text-[11px] leading-5 font-medium text-primary/45">
									Números do mês: {item.context}
								</p>
							{/if}
						</div>
					{/each}
				</div>
			</article>
		</section>

		<section class="grid gap-4 xl:grid-cols-5">
			<article class="rounded-xl border border-primary/10 bg-white p-6 shadow-sm xl:col-span-3">
				<div class="flex items-center justify-between gap-4">
					<h2 class="text-xl font-bold text-primary">Pesquisa de impacto</h2>
					<span class="text-xs font-semibold text-primary/50">Onda 1 × Onda 2</span>
				</div>
				<p class="mt-2 text-sm leading-5 text-primary/60">
					Os resultados e a autonomia são apresentados em tabela para não misturar escalas no mesmo
					eixo visual.
				</p>
				<div class="mt-5 overflow-x-auto rounded-lg border border-primary/10">
					<table class="w-full min-w-[430px] border-collapse text-left text-xs">
						<thead class="bg-primary/5 text-primary/60">
							<tr>
								<th class="px-3 py-2 font-semibold">Indicador</th>
								<th class="px-3 py-2 text-right font-semibold">Onda 1</th>
								<th class="px-3 py-2 text-right font-semibold">Onda 2</th>
							</tr>
						</thead>
						<tbody>
							{#each impactRows as row (row.key)}
								<tr
									class={`border-t border-primary/10 ${row.category === 'evidence' ? 'bg-secondary/5' : ''}`}
								>
									<td class="px-3 py-2 font-medium text-primary/75">
										{row.label.join(' ')}
										{#if row.category === 'evidence'}
											<span class="ml-1 text-[10px] text-primary/50">(evidência)</span>
										{/if}
									</td>
									<td class="px-3 py-2 text-right font-mono text-primary">
										{formatImpactValue(row, row.waveOne)}
									</td>
									<td class="px-3 py-2 text-right font-mono text-primary">
										{formatImpactValue(row, row.waveTwo)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</article>

			<article class="rounded-xl border border-primary/10 bg-white p-6 shadow-sm xl:col-span-2">
				<h2 class="text-xl font-bold text-primary">Qualidade e limitações dos dados</h2>
				<p class="mt-3 text-sm leading-6 text-primary/70">
					A taxa de resposta da pesquisa de impacto caiu de
					<strong class="text-primary">{impactValue('response', 'waveOne')}%</strong> para
					<strong class="text-primary">{impactValue('response', 'waveTwo')}%</strong>.
				</p>
				<ul class="mt-4 space-y-3 text-sm leading-6 text-primary/70">
					<li>
						As duas ondas podem não ter exatamente os mesmos respondentes; a comparação deve ser
						interpretada com cautela.
					</li>
					<li>
						Os dados de membros, novos membros, retenção e churn não necessariamente fecham em uma
						identidade simples de estoque; é necessário validar definição e denominador.
					</li>
					<li>
						Os temas do WhatsApp são sinais qualitativos agregados, não uma amostra completa de
						todas as conversas.
					</li>
				</ul>
			</article>
		</section>

		<section>
			<h2 class="mt-1 mb-4 text-2xl font-bold text-primary">
				Cinco movimentos para recuperar a comunidade
			</h2>

			<div class="grid gap-4 lg:grid-cols-2">
				{#each actionPlan as item (item.priority)}
					<article
						class="flex h-full flex-col rounded-xl border border-primary/10 bg-white p-5 shadow-sm"
					>
						<div class="flex items-start justify-between gap-4">
							<div class="flex items-center gap-3">
								<span
									class="inline-flex size-9 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-white"
								>
									{item.priority}
								</span>
								<h3 class="text-base font-bold text-primary">{item.title}</h3>
							</div>
						</div>
						<p class="mt-4 text-xs leading-5 font-semibold text-rose-700">
							Sinal observado: {item.signal}
						</p>
						{#if item.hypothesis}
							<p class="mt-3 text-xs leading-5 text-primary/65">
								<strong class="text-primary">Hipótese:</strong>
								{item.hypothesis}
							</p>
						{/if}
						<p class="mt-3 mb-4 text-sm leading-6 text-primary/70">
							<strong class="text-primary">Experimento/ação:</strong>
							{item.experiment}
						</p>

						<div
							class="mt-auto flex items-start gap-2 border-t border-primary/10 pt-3 text-xs leading-5 text-primary/60"
						>
							<strong class="text-primary">Métrica de sucesso:</strong>
							{item.measure}
						</div>
					</article>
				{/each}
			</div>
		</section>
	</div>
{/if}
