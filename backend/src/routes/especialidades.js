const express = require('express');
const { getEspecialidades } = require('../controllers/especialidadesController');

const router = express.Router();

router.get('/', getEspecialidades);

module.exports = router;
