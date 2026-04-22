# DentalCare — Sistema de Agendamento

Sistema completo para a clínica DentalCare com:
- Frontend HTML/CSS/JS (landing page + formulário de agendamento)
- Backend Node.js + Express + Prisma + SQLite
- Automação via n8n + WAHA (WhatsApp)

---

## Estrutura do Projeto

```
automacaon8nclinica/
├── frontend/          Landing page + formulário de agendamento online
├── backend/           API REST (Node.js + Express + Prisma + SQLite)
├── n8n/               Workflows exportados do n8n
├── agendamento-confirmacao.json  Workflow n8n completo (PostgreSQL)
├── n8n-setup.md       Guia de integração n8n ↔ backend
└── README.md
```

---

## Pré-requisitos

- Node.js 18+
- npm

---

## 1. Instalando e rodando o Backend

```bash
cd backend

# Instalar dependências
npm install

# Gerar o cliente Prisma, criar o banco SQLite e popular com dados
npm run setup

# Iniciar em modo desenvolvimento (com hot-reload)
npm run dev

# Iniciar em modo produção
npm start
```

O servidor sobe em: **http://localhost:3000**

Verifique: http://localhost:3000/api/health

### Scripts disponíveis

| Script           | O que faz                                    |
|------------------|----------------------------------------------|
| `npm run dev`    | Inicia com nodemon (hot-reload)              |
| `npm start`      | Inicia sem hot-reload                        |
| `npm run setup`  | Cria banco + migrate + seed (primeira vez)   |
| `npm run migrate`| Executa migrações Prisma                     |
| `npm run seed`   | Popula o banco com dados iniciais            |

---

## 2. Rodando o Frontend

O frontend é HTML puro. Use o **Live Server** do VS Code:

1. Abra a pasta `frontend/` no VS Code
2. Clique com botão direito em `index.html` → **Open with Live Server**
3. Acesse: **http://127.0.0.1:5500**

> O frontend faz chamadas para `http://localhost:3000/api`. O backend precisa estar rodando.

---

## 3. Variáveis de Ambiente

Arquivo: `backend/.env`

```env
PORT=3000
DATABASE_URL="file:./dev.db"
API_KEY="dk_clinica_2026_xK9mP3nQ7rL5wV2j"
FRONTEND_URL="http://127.0.0.1:5500"
```

---

## 4. Endpoints da API

### Endpoints públicos (para o frontend)

| Método | Rota                                      | Descrição                                        |
|--------|-------------------------------------------|--------------------------------------------------|
| GET    | `/api/health`                             | Status do servidor                               |
| GET    | `/api/especialidades`                     | Lista todas as especialidades                    |
| GET    | `/api/horarios?data=&especialidade=`      | Horários disponíveis por data/especialidade      |
| POST   | `/api/agendamentos`                       | Cria agendamento (body: nome, telefone, consultaId) |
| GET    | `/api/agendamentos/:telefone`             | Consultas agendadas por telefone                 |

### Endpoints do webhook (para o n8n — requer header `X-API-Key`)

| Método | Rota                                        | Descrição                         |
|--------|---------------------------------------------|-----------------------------------|
| POST   | `/api/webhook/agendamento`                  | Agenda via WhatsApp               |
| GET    | `/api/webhook/horarios-disponiveis?data=`   | Horários disponíveis por data     |
| GET    | `/api/webhook/agendamento/:telefone`        | Consultas de um paciente          |
| DELETE | `/api/webhook/agendamento/:id`              | Cancela agendamento               |

---

## 5. Conectando o n8n ao Backend

Consulte o arquivo **[n8n-setup.md](./n8n-setup.md)** para:
- URL base dos webhooks
- Como configurar a API Key no n8n
- Exemplos de payload para cada endpoint
- Fluxo sugerido para agendamento via WhatsApp

### URL do backend para o n8n rodando em Docker

```
http://host.docker.internal:3000/api/webhook
```

---

## 6. Banco de Dados

SQLite (arquivo `backend/dev.db`) — não requer instalação.

Tabelas criadas pelo Prisma:
- `Especialidade` — especialidades odontológicas
- `Medico` — médicos vinculados a especialidades
- `Consulta` — slots de horário (disponivel / agendado)

Para resetar e repopular o banco:
```bash
cd backend
npx prisma migrate reset --force
node prisma/seed.js
```

---

## 7. Workflow n8n existente

O arquivo `agendamento-confirmacao.json` contém o workflow completo que:
- Recebe mensagens do WhatsApp via WAHA
- Usa IA (Groq / llama-3.1-8b-instant) para entender a intenção
- Consulta/cria/cancela agendamentos direto no **PostgreSQL**

Para importar no n8n: **Workflows → Import from File → selecione o JSON**

> O workflow atual usa PostgreSQL. Para usar o backend REST, configure as credenciais Postgres ou troque as ferramentas SQL por nós HTTP Request conforme descrito em `n8n-setup.md`.
