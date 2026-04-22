const express = require('express');
const { apiKeyAuth } = require('../middleware/auth');
const {
  criarAgendamento,
  getHorariosDisponiveis,
  getAgendamentoPorTelefone,
  cancelarAgendamento,
} = require('../controllers/webhookController');

const router = express.Router();

router.use(apiKeyAuth);

// POST /api/webhook/agendamento
router.post('/agendamento', criarAgendamento);

// GET /api/webhook/horarios-disponiveis?data=YYYY-MM-DD
router.get('/horarios-disponiveis', getHorariosDisponiveis);

// GET /api/webhook/agendamento/:telefone
router.get('/agendamento/:telefone', getAgendamentoPorTelefone);

// DELETE /api/webhook/agendamento/:id
router.delete('/agendamento/:id', cancelarAgendamento);

module.exports = router;
