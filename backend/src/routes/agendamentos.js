const express = require('express');
const {
  criarAgendamento,
  getAgendamentosPorTelefone,
} = require('../controllers/agendamentosController');

const router = express.Router();

// POST /api/agendamentos
router.post('/', criarAgendamento);

// GET /api/agendamentos/:telefone
router.get('/:telefone', getAgendamentosPorTelefone);

module.exports = router;
