<script>
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import Download from '@lucide/svelte/icons/download';
	import FileText from '@lucide/svelte/icons/file-text';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Upload from '@lucide/svelte/icons/upload';
	import { appData, downloadCsv, importCsvPair, resetToDefaults } from '$lib/data/csvData';

	let data = $derived($appData);
	let principalFile = $state(null);
	let impactFile = $state(null);
	let isBusy = $state(false);
	let notice = $state('');
	let error = $state('');

	const handleFileChange = (event, type) => {
		const file = event.currentTarget.files?.[0] ?? null;
		if (type === 'principal') {
			principalFile = file;
		} else {
			impactFile = file;
		}
		notice = '';
		error = '';
	};

	const importFiles = async () => {
		notice = '';
		error = '';

		if (!principalFile && !impactFile) {
			error = 'Selecione pelo menos um arquivo CSV para importar.';
			return;
		}

		isBusy = true;
		try {
			const [principalText, impactText] = await Promise.all([
				principalFile ? principalFile.text() : Promise.resolve(undefined),
				impactFile ? impactFile.text() : Promise.resolve(undefined)
			]);

			importCsvPair({
				principalText,
				impactText,
				principalFileName: principalFile?.name,
				impactFileName: impactFile?.name
			});
			notice =
				principalFile && impactFile
					? 'Dados importados!'
					: principalFile
						? 'Dados mensais importados!'
						: 'Dados de impacto importados!';
			principalFile = null;
			impactFile = null;
		} catch (importError) {
			error =
				importError instanceof Error
					? importError.message
					: 'Não foi possível interpretar os arquivos selecionados.';
		} finally {
			isBusy = false;
		}
	};

	const resetData = async () => {
		notice = '';
		error = '';
		isBusy = true;

		try {
			await resetToDefaults();
			notice = 'Dados padrão restaurados';
			principalFile = null;
			impactFile = null;
		} catch (resetError) {
			error =
				resetError instanceof Error
					? resetError.message
					: 'Não foi possível restaurar os arquivos padrão.';
		} finally {
			isBusy = false;
		}
	};
</script>

<svelte:head>
	<title>Automação | Comunidade Voo</title>
	<meta name="description" content="Importação e exportação dos dados da Comunidade Voo." />
</svelte:head>

{#if data.status === 'loading'}
	<div class="rounded-xl border border-primary/10 bg-white p-6 text-sm text-primary/65 shadow-sm">
		Carregando os arquivos
	</div>
{:else if data.status === 'error'}
	<div class="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800 shadow-sm">
		<p class="font-bold">Não foi possível preparar a automação.</p>
		<p class="mt-1">{data.error}</p>
	</div>
{:else}
	<div class="space-y-6 pb-8">
		<section class="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm md:p-8">
			<div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
				<div class="max-w-3xl">
					<h1 class="text-3xl leading-tight font-bold text-primary md:text-4xl">
						Importar e exportar dados
					</h1>
					<p class="mt-3 text-sm leading-6 text-primary/65 md:text-base">
						Integração com planilhas, bancos de dados ou APIs usando CSV.
					</p>
				</div>
				{#if data.source === 'imported'}
					<button
						type="button"
						class="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none"
						disabled={isBusy || data.source === 'default'}
						onclick={resetData}
					>
						<RotateCcw size={16} />
						Restaurar arquivos padrão
					</button>
				{/if}
			</div>
		</section>

		<section class="grid gap-4 lg:grid-cols-2">
			<article class="rounded-xl border border-primary/10 bg-white p-6 shadow-sm">
				<div class="flex items-center gap-3">
					<div class="rounded-lg bg-primary/10 p-2 text-primary">
						<Download size={19} />
					</div>
					<h2 class="text-lg font-bold text-primary">Baixar dados atuais</h2>
				</div>

				<div class="mt-5 space-y-3">
					<div
						class="flex items-center justify-between gap-4 rounded-lg border border-primary/10 p-3"
					>
						<div class="flex min-w-0 items-center gap-3">
							<FileText class="shrink-0 text-secondary" size={18} />
							<div class="min-w-0">
								<p class="text-sm font-semibold text-primary">Dados principais</p>
								<p class="truncate text-xs text-primary/50">{data.principalFileName}</p>
							</div>
						</div>
						<button
							type="button"
							class="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none"
							onclick={() => downloadCsv(data.raw.principal, data.principalFileName)}
						>
							<Download size={14} />
							Baixar
						</button>
					</div>

					<div
						class="flex items-center justify-between gap-4 rounded-lg border border-primary/10 p-3"
					>
						<div class="flex min-w-0 items-center gap-3">
							<FileText class="shrink-0 text-secondary" size={18} />
							<div class="min-w-0">
								<p class="text-sm font-semibold text-primary">Pesquisa de impacto</p>
								<p class="truncate text-xs text-primary/50">{data.impactFileName}</p>
							</div>
						</div>
						<button
							type="button"
							class="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none"
							onclick={() => downloadCsv(data.raw.impact, data.impactFileName)}
						>
							<Download size={14} />
							Baixar
						</button>
					</div>
				</div>
			</article>

			<article class="rounded-xl border border-primary/10 bg-white p-6 shadow-sm">
				<div class="flex items-center gap-3">
					<div class="rounded-lg bg-secondary/20 p-2 text-primary">
						<Upload size={19} />
					</div>
					<h2 class="text-lg font-bold text-primary">Importar nova atualização</h2>
				</div>

				<div class="mt-5 space-y-3">
					<label
						for="principal-csv"
						class="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-primary/20 p-3 transition hover:border-secondary hover:bg-secondary/5"
					>
						<span class="min-w-0">
							<span class="block text-sm font-semibold text-primary">CSV principal</span>
							<span class="mt-1 block truncate text-xs text-primary/50">
								{principalFile?.name ?? 'Selecionar arquivo'}
							</span>
						</span>
						<span class="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white"
							>Selecionar</span
						>
						<input
							id="principal-csv"
							type="file"
							accept=".csv,text/csv"
							class="sr-only"
							onchange={(event) => handleFileChange(event, 'principal')}
						/>
					</label>

					<label
						for="impact-csv"
						class="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-primary/20 p-3 transition hover:border-secondary hover:bg-secondary/5"
					>
						<span class="min-w-0">
							<span class="block text-sm font-semibold text-primary"
								>CSV de pesquisa de impacto</span
							>
							<span class="mt-1 block truncate text-xs text-primary/50">
								{impactFile?.name ?? 'Selecionar arquivo'}
							</span>
						</span>
						<span class="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white"
							>Selecionar</span
						>
						<input
							id="impact-csv"
							type="file"
							accept=".csv,text/csv"
							class="sr-only"
							onchange={(event) => handleFileChange(event, 'impact')}
						/>
					</label>

					<button
						type="button"
						class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-bold text-primary transition hover:-translate-y-0.5 hover:bg-secondary/90 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isBusy || (!principalFile && !impactFile)}
						onclick={importFiles}
					>
						<Upload size={17} />
						{isBusy ? 'Processando...' : 'Importar arquivo(s) selecionado(s)'}
					</button>
				</div>
			</article>
		</section>

		{#if notice}
			<div
				class="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
			>
				<CheckCircle2 class="mt-0.5 shrink-0" size={17} />
				<p>{notice}</p>
			</div>
		{/if}

		{#if error}
			<div
				class="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
			>
				<CircleAlert class="mt-0.5 shrink-0" size={17} />
				<p>{error}</p>
			</div>
		{/if}
	</div>
{/if}
