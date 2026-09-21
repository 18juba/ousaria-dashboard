# Dashboard Comunidade Voo

## Escopo

- Dashboard com evolução mensal dos indicadores das seções 3.1, 3.2 e 3.3.
- Relatório analítico com fatos, hipóteses, experimentos, limitações e recomendações.
- Importação e exportação de CSVs.

## Executar localmente

Navegue por linha de comando até a pasta /dashboard, então execute:

```sh
bun install
bun run dev
```

É necessário ter a ferramenta de JavaScript Bun instalada

## Dados

Os arquivos padrão ficam em `static/data`:

- `comunidade_voo-principal.csv`
- `comunidade_voo-pesquisa_impacto.csv`

## Páginas

- `/` — dashboard.
- `/relatorio` — análise analítica e plano de recuperação.
- `/automacao` — prova de conceito de importação e exportação de dados.

## Automação futura

Uma versão produtiva poderia coletar dados de Google Sheets, APIs ou ferramentas de BI em rotina agendada usando n8n, Make, Zapier ou Python.

## Como a IA foi utilizada

A IA foi utilizada como apoio no desenvolvimento, revisão de aderência ao briefing, exploração dos dados, formulação de hipóteses e revisão da análise.
As métricas e conclusões foram validadas manualmente contra os dados originais, e sugestões que implicavam causalidade sem evidência suficiente foram ajustadas ou descartadas.  
Registro do processo com IA: https://chatgpt.com/s/cx_6ab1485442e881919583d62a2777adf6

## Google Sheets

Dados do documento PDF formatados em planilha do Google Sheets: https://docs.google.com/spreadsheets/d/1ogOKyrSIRQ6t9BY5lnuwBTqnOvwqgEXqnoR9-ne0jbQ/edit?usp=sharing