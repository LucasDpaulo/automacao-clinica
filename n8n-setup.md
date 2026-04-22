# Guia de Configuração do n8n — DentalCare

## URL Base dos Webhooks

```
http://localhost:3000/api/webhook
```

> Em produção, substitua `localhost:3000` pelo endereço do seu servidor.

---

## API Key

**Valor:** `dk_clinica_2026_xK9mP3nQ7rL5wV2j`

Configure no n8n como **HTTP Header**:
- Header name: `X-API-Key`
- Header value: `dk_clinica_2026_xK9mP3nQ7rL5wV2j`

> Troque esta chave no arquivo `backend/.env` antes de subir para produção.

---

## Endpoints Disponíveis

### 1. Criar Agendamento
**POST** `/api/webhook/agendamento`

```json
{
  "nome": "João da Silva",
  "telefone": "558799999999",
  "data": "2026-04-25",
  "hora": "10:00",
  "tipoConsulta": "Clínico Geral"
}
```

Resposta (sucesso):
```json
{
  "sucesso": true,
  "mensagem": "Sua consulta foi agendada com sucesso! Você será atendido(a) em 2026-04-25 às 10:00 com Dr. João Silva (Clínico Geral). Até lá!",
  "dadosAgendamento": {
    "id": 1,
    "pacienteNome": "João da Silva",
    "telefone": "558799999999",
    "data": "2026-04-25",
    "hora": "10:00",
    "medico": "Dr. João Silva",
    "especialidade": "Clínico Geral",
    "status": "agendado"
  }
}
```

Resposta (horário indisponível):
```json
{
  "sucesso": false,
  "mensagem": "Desculpe, não encontrei horário disponível para 2026-04-25 às 10:00. Gostaria de ver outros horários disponíveis?"
}
```

---

### 2. Consultar Horários Disponíveis
**GET** `/api/webhook/horarios-disponiveis?data=2026-04-25`

Resposta:
```json
{
  "sucesso": true,
  "mensagem": "Horários disponíveis para 2026-04-25:",
  "horarios": [
    { "id": 1, "data": "2026-04-25", "hora": "09:00", "medico": "Dr. João Silva", "especialidade": "Clínico Geral" },
    { "id": 2, "data": "2026-04-25", "hora": "10:00", "medico": "Dr. João Silva", "especialidade": "Clínico Geral" },
    { "id": 4, "data": "2026-04-25", "hora": "09:00", "medico": "Dra. Maria Souza", "especialidade": "Periodontista" }
  ]
}
```

---

### 3. Consultas de um Paciente
**GET** `/api/webhook/agendamento/:telefone`

Exemplo: `GET /api/webhook/agendamento/558799999999`

Resposta:
```json
{
  "sucesso": true,
  "mensagem": "Encontrei 1 consulta(s) agendada(s).",
  "agendamentos": [
    {
      "id": 1,
      "pacienteNome": "João da Silva",
      "telefone": "558799999999",
      "data": "2026-04-25",
      "hora": "10:00",
      "medico": "Dr. João Silva",
      "especialidade": "Clínico Geral",
      "status": "agendado"
    }
  ]
}
```

---

### 4. Cancelar Agendamento
**DELETE** `/api/webhook/agendamento/:id`

Exemplo: `DELETE /api/webhook/agendamento/1`

Resposta:
```json
{
  "sucesso": true,
  "mensagem": "Sua consulta do dia 2026-04-25 às 10:00 foi cancelada com sucesso. Se precisar agendar novamente, é só me chamar!"
}
```

---

## Fluxo Sugerido no n8n para Agendamento via WhatsApp

O workflow já está configurado no arquivo `agendamento-confirmacao.json` (usa PostgreSQL diretamente via ferramentas do AI Agent).

Para usar os endpoints REST no lugar das ferramentas SQL, substitua as ferramentas `postgresTool` por nós `HTTP Request`:

### Passo a passo alternativo com HTTP Request:

```
1. Trigger: Webhook (WAHA envia mensagem do paciente)
   └── Campos extraídos: nome, telefone, mensagem, session, chatId

2. IF: mensagem contém "horários" ou "agendar"
   └── TRUE → chama GET /horarios-disponiveis?data=...
   └── Exibe lista de opções formatadas para o paciente

3. IF: paciente escolheu horário
   └── POST /agendamento
       Body: { nome, telefone, data, hora, tipoConsulta }
   └── Resposta já vem em português pronta para enviar

4. IF: mensagem contém "cancelar"
   └── GET /agendamento/:telefone → busca id da consulta
   └── DELETE /agendamento/:id
   └── Envia confirmação do cancelamento

5. Send Text (WAHA): envia o campo "mensagem" da resposta ao paciente
```

### Configuração do nó HTTP Request no n8n:

- **Method:** POST (ou GET/DELETE conforme o endpoint)
- **URL:** `http://host.docker.internal:3000/api/webhook/agendamento`
  > Use `host.docker.internal` se o n8n rodar no Docker e o backend no host
- **Headers:**
  - `Content-Type: application/json`
  - `X-API-Key: dk_clinica_2026_xK9mP3nQ7rL5wV2j`

---

## Especialidades disponíveis no banco

| Nome              | Médico             |
|-------------------|--------------------|
| Clínico Geral     | Dr. João Silva     |
| Periodontista     | Dra. Maria Souza   |
| Endodontista      | Dr. Carlos Lima    |
| Ortodontista      | Dra. Ana Costa     |
| Implantodontista  | Dr. Pedro Rocha    |
