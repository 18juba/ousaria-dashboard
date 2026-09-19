<script>
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import TrendingDown from '@lucide/svelte/icons/trending-down';
	import { resolve } from '$app/paths';
	import { impactData, monthlyMetrics, whatsappThemes } from '$lib/data/voo';

	const firstMonth = monthlyMetrics[0];
	const firstComparableMonth = monthlyMetrics[1];
	const currentMonth = monthlyMetrics[monthlyMetrics.length - 1];

	const formatSigned = (value) => (value > 0 ? '+' : value < 0 ? '−' : '') + Math.abs(value);
	const formatPp = (value) => formatSigned(value) + ' p.p.';

	const totalMemberGrowth = currentMonth.activeMembers - firstMonth.activeMembers;
	const totalMemberGrowthRate = Math.round((totalMemberGrowth / firstMonth.activeMembers) * 100);
	const growthRateDelta = currentMonth.growthRate - firstComparableMonth.growthRate;
	const newMembersChangeRate = Math.round(
		((currentMonth.newMembers - firstComparableMonth.newMembers) /
			firstComparableMonth.newMembers) *
			100
	);
	const participationDelta = currentMonth.participationRate - firstMonth.participationRate;
	const engagementDelta = currentMonth.engagementRate - firstMonth.engagementRate;
	const churnDelta = currentMonth.churnRate - firstComparableMonth.churnRate;

	const impactRows = impactData.labels.map((label, index) => {
		const waveOne = impactData.datasets[0].data[index];
		const waveTwo = impactData.datasets[1].data[index];

		return {
			metric: label.join(' '),
			waveOne,
			waveTwo,
			delta: waveTwo - waveOne
		};
	});

	const themeAnalysis = [
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
				'O horário fixo cria uma barreira de participação e pode explicar parte da queda de presença.'
		},
		{
			reading:
				'A percepção de repetição indica que o formato perdeu novidade antes de a base atingir a meta de 300 membros.'
		},
		{
			reading:
				'Responder apenas a lembretes automáticos é um sinal de comunidade passiva, não de conversa espontânea.'
		}
	].map((reading, index) => ({ ...whatsappThemes[index], ...reading }));

	const actionPlan = [
		{
			priority: '01',
			title: 'Reativar a conversa orgânica',
			evidence: 'Em setembro, a maior parte das interações já era resposta a lembretes.',
			action:
				'Reduzir mensagens automáticas, criar uma enquetes diárias, destacar conquistas dos membros e estabelecer mediação ativa no grupo.',
			measure: 'Mensagens espontâneas por semana e participação mensal.'
		},
		{
			priority: '02',
			title: 'Revisar o ritual e o acesso',
			evidence:
				'A reclamação sobre terça-feira às 19h aparece antes da queda mais forte de participação.',
			action:
				'Aplicar uma enquete de horários, testar um segundo turno ou encontro alternativo e disponibilizar resumo acionável para quem não puder participar.',
			measure: 'Participação, resposta à pesquisa e presença por horário.'
		},
		{
			priority: '03',
			title: 'Voltar ao conteúdo que resolve',
			evidence:
				'Precificação e fluxo de caixa geraram dúvidas; depois, os encontros passaram a ser percebidos como repetitivos.',
			action:
				'Incluir precificação e fluxo de caixa como temas recorrentes dos encontros semanais, com aulas sobre os fundamentos, exemplos práticos e espaço para debate e dúvidas; variar a abordagem ao longo do mês para evitar a sensação de repetição.',
			measure: 'Engajamento, NPS do encontro e avaliação de utilidade.'
		},
		{
			priority: '04',
			title: 'Fazer o networking acontecer',
			evidence: 'A conexão de negócios caiu de 63% na Onda 1 para 29% na Onda 2.',
			action:
				'Organizar uma rodada de pedidos e ofertas, curar apresentações entre membros e acompanhar se as indicações viraram conversas ou parcerias.',
			measure: 'Introduções realizadas e conexões de negócio geradas.'
		},
		{
			priority: '05',
			title: 'Retomar crescimento por indicação',
			evidence: 'A entrada mensal caiu de 28 novos membros em maio para 9 em setembro.',
			action:
				'Ativar membros satisfeitos como embaixadores, usar histórias de resultado e convidar perfis que complementem as necessidades atuais da rede.',
			measure: 'Novos membros por mês e crescimento mensal acima de 6%.'
		}
	];
</script>

<svelte:head>
	<title>Relatório | Comunidade Voo</title>
	<meta
		name="description"
		content="Avaliação aprofundada dos dados e plano de recuperação da Comunidade Voo."
	/>
</svelte:head>

<div class="space-y-6 pb-8">
	<section class="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm md:p-8">
		<div class="max-w-3xl">
			<h1 class="text-3xl leading-tight font-bold text-primary md:text-4xl">
				Renovação de contrato, mas com um plano claro de recuperação
			</h1>
			<p class="mt-4 max-w-2xl text-sm leading-6 text-primary/70 md:text-base">
				A comunidade ainda cresceu em tamanho, mas perdeu força na participação, no engajamento e na
				geração de valor entre membros. A recomendação é apoiar a renovação com um ciclo de
				recuperação de 90 dias, metas explícitas e revisão mensal.
			</p>
		</div>

		<div class="mt-8 grid gap-4 lg:grid-cols-2">
			<div class="rounded-xl bg-primary p-5 text-white">
				<div class="flex items-center gap-2 text-secondary">
					<CircleAlert size={18} />
					<p class="text-xs font-bold tracking-[0.12em] uppercase">Hipótese Central</p>
				</div>
				<p class="mt-3 text-lg font-bold">
					Desgaste da experiência: encontros previsíveis, horário pouco acessível e WhatsApp usado
					mais como mural de avisos do que como comunidade.
				</p>
			</div>
			<div class="rounded-xl border border-secondary/30 bg-secondary/10 p-5 text-primary">
				<p class="text-xs font-bold tracking-[0.12em] text-primary/55 uppercase">Problema</p>
				<p class="mt-3 text-lg font-bold">
					O problema atual é menos falta de interesse e mais perda de hábito, relevância e conexão.
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
					<strong class="text-primary">{totalMemberGrowthRate}%</strong>. Isso sustenta a decisão de
					renovar: existe demanda e a comunidade ainda tem escala para gerar valor.
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
					<strong class="text-rose-700">{Math.abs(engagementDelta)} p.p.</strong>, respectivamente.
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
				<h2 class="text-xl font-bold text-primary">O que mostra o Whatsapp</h2>
			</div>
			<p class="mt-2 text-sm leading-5 text-primary/60">
				Os temas recorrentes ajudam a explicar a mudança de comportamento ao longo do período.
			</p>

			<div class="mt-5 max-h-60 space-y-4 overflow-y-auto pr-1">
				{#each themeAnalysis as item (item.month)}
					<div class="border-b border-primary/10 pb-4 last:border-0 last:pb-0">
						<span class="font-mono text-[11px] font-bold text-primary">{item.month}</span>
						<p class="mt-2 text-xs leading-5 font-semibold text-primary/80">{item.theme}</p>
						<p class="mt-1 text-xs leading-5 text-primary/55">{item.reading}</p>
					</div>
				{/each}
			</div>
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
						Evidência: {item.evidence}
					</p>
					<p class="mt-3 mb-4 Dtext-sm leading-6 text-primary/70">{item.action}</p>

					<div
						class="mt-auto flex items-start gap-2 border-t border-primary/10 pt-3 text-xs leading-5 text-primary/60"
					>
						<strong class="text-primary">Medir:</strong>
						{item.measure}
					</div>
				</article>
			{/each}
		</div>
	</section>
</div>
