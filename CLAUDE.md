# automacao-clinica

Projeto de faculdade: sistema de automação para clínica.

## Repositório
- GitHub: https://github.com/LucasDpaulo/automacao-clinica
- Dono: LucasDpaulo
- Visibilidade: público
- Colaboradores (permissão de push): Gabriel-Brito39, DavidRdS, Joaoalison

## Estrutura (monorepo)
- `frontend/` — interface
- `backend/` — API / lógica de negócio
- `database/` — schema, migrations, seeds
- `n8n/` — workflows de automação exportados

## Branches
- `main` — versão estável/apresentável. Protegida por convenção (só recebe merge via PR vindo da `dev`).
- `dev` — branch de integração. Features são mergeadas aqui primeiro.
- `feat/*`, `fix/*`, `n8n/*` — feature branches curtas, criadas a partir da `dev`.

## Fluxo de trabalho
Documentado em `FLUXO.md` (voltado ao time). Resumo: ninguém commita direto em `main` ou `dev`; sempre via PR a partir de feature branch.

## Histórico
- Repositório criado em 2026-04-21
- Estrutura inicial (pastas + READMEs) commitada na `main`
- Branch `dev` criada a partir da `main`
- `FLUXO.md` adicionado com guia do time
