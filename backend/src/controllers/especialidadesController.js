const especialidadesService = require('../services/especialidadesService');

async function getEspecialidades(req, res, next) {
  try {
    const especialidades = await especialidadesService.listar();
    res.json(especialidades);
  } catch (err) {
    next(err);
  }
}

module.exports = { getEspecialidades };
