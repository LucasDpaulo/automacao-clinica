const express = require('express');
const { getHorariosDisponiveis } = require('../controllers/horariosController');

const router = express.Router();

// GET /api/horarios?data=YYYY-MM-DD&especialidade=Clínico Geral
router.get('/', getHorariosDisponiveis);

module.exports = router;
