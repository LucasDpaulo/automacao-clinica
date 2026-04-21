# Fluxo de trabalho do projeto

Leiam antes de commitar 🙏

## Branches principais

- **`main`** → versão "oficial", sempre funcionando. É o que vamos apresentar.
- **`dev`** → onde integramos o trabalho de todo mundo. É aqui que o código "se encontra".

**Regra de ouro:** ninguém commita direto na `main` nem na `dev`. Sempre trabalhamos em uma *branch própria* e depois abrimos um Pull Request.

## Passo a passo toda vez que for começar algo novo

1. Atualizar a `dev` local:
   ```bash
   git checkout dev
   git pull
   ```

2. Criar uma branch pra sua tarefa (nome descritivo, sem espaço):
   ```bash
   git checkout -b feat/tela-login
   ```
   Exemplos de nome: `feat/cadastro-paciente`, `fix/bug-agendamento`, `n8n/workflow-confirmacao`

3. Fazer seu trabalho normalmente, commitando várias vezes:
   ```bash
   git add .
   git commit -m "mensagem do que fez"
   ```

4. Quando terminar, mandar pro GitHub:
   ```bash
   git push -u origin feat/tela-login
   ```

5. Abrir Pull Request no GitHub **da sua branch para a `dev`** (não pra main!). Pedir pra alguém do grupo revisar antes de mergear.

## Estrutura do repositório

Cada um trabalha na sua pasta, sem pisar no código do outro:

- `frontend/` — interface
- `backend/` — API / lógica
- `database/` — scripts de banco
- `n8n/` — workflows de automação

## Indo pra main

Quando a `dev` estiver estável (ex: fim de semana antes de entregar algo), fazemos um PR da `dev` → `main`.
