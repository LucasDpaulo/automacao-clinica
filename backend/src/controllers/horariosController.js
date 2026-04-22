const horariosService = require('../services/horariosService');

async function getHorariosDisponiveis(req, res, next) {
  try {
    const { data, especialidade } = req.query;
    const horarios = await horariosService.buscarDisponiveis({ data, especialidade });
    res.json(horarios);
  } catch (err) {
    next(err);
  }
}

module.exports = { getHorariosDisponiveis };
