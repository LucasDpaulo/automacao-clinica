const agendamentosService = require('../services/agendamentosService');

async function criarAgendamento(req, res, next) {
  try {
    const { nome, telefone, consultaId } = req.body;

    if (!nome || !telefone || !consultaId) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Campos obrigatórios: nome, telefone, consultaId.',
      });
    }

    const agendamento = await agendamentosService.criarPeloSite({
      nome: nome.trim(),
      telefone: telefone.trim(),
      consultaId: parseInt(consultaId),
    });

    res.status(201).json({
      sucesso: true,
      mensagem: `Consulta agendada para ${agendamento.data} às ${agendamento.hora} com ${agendamento.medico}.`,
      agendamento,
    });
  } catch (err) {
    next(err);
  }
}

async function getAgendamentosPorTelefone(req, res, next) {
  try {
    const { telefone } = req.params;
    const agendamentos = await agendamentosService.buscarPorTelefone(telefone);
    res.json(agendamentos);
  } catch (err) {
    next(err);
  }
}

module.exports = { criarAgendamento, getAgendamentosPorTelefone };
