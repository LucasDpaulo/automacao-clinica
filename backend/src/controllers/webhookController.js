const agendamentosService = require('../services/agendamentosService');
const horariosService = require('../services/horariosService');

async function criarAgendamento(req, res, next) {
  try {
    const { nome, telefone, data, hora, tipoConsulta } = req.body;

    if (!nome || !telefone || !data || !hora) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Campos obrigatórios: nome, telefone, data, hora.',
      });
    }

    const agendamento = await agendamentosService.criarViaWebhook({
      nome: nome.trim(),
      telefone: telefone.trim(),
      data,
      hora,
      tipoConsulta: tipoConsulta || null,
    });

    if (!agendamento) {
      return res.status(409).json({
        sucesso: false,
        mensagem: `Desculpe, não encontrei horário disponível para ${data} às ${hora}. Gostaria de ver outros horários disponíveis?`,
      });
    }

    res.status(201).json({
      sucesso: true,
      mensagem: `Sua consulta foi agendada com sucesso! Você será atendido(a) em ${agendamento.data} às ${agendamento.hora} com ${agendamento.medico} (${agendamento.especialidade}). Até lá!`,
      dadosAgendamento: agendamento,
    });
  } catch (err) {
    next(err);
  }
}

async function getHorariosDisponiveis(req, res, next) {
  try {
    const { data } = req.query;

    if (!data) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Informe a data no formato YYYY-MM-DD.',
      });
    }

    const horarios = await horariosService.buscarDisponiveis({ data });

    if (horarios.length === 0) {
      return res.json({
        sucesso: true,
        mensagem: `Não há horários disponíveis para ${data}.`,
        horarios: [],
      });
    }

    res.json({
      sucesso: true,
      mensagem: `Horários disponíveis para ${data}:`,
      horarios,
    });
  } catch (err) {
    next(err);
  }
}

async function getAgendamentoPorTelefone(req, res, next) {
  try {
    const { telefone } = req.params;
    const agendamentos = await agendamentosService.buscarPorTelefone(telefone);

    if (agendamentos.length === 0) {
      return res.json({
        sucesso: true,
        mensagem: 'Não encontrei consultas agendadas para este número.',
        agendamentos: [],
      });
    }

    res.json({
      sucesso: true,
      mensagem: `Encontrei ${agendamentos.length} consulta(s) agendada(s).`,
      agendamentos,
    });
  } catch (err) {
    next(err);
  }
}

async function cancelarAgendamento(req, res, next) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
    }

    const cancelado = await agendamentosService.cancelar(id);

    res.json({
      sucesso: true,
      mensagem: `Sua consulta do dia ${cancelado.data} às ${cancelado.hora} foi cancelada com sucesso. Se precisar agendar novamente, é só me chamar!`,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  criarAgendamento,
  getHorariosDisponiveis,
  getAgendamentoPorTelefone,
  cancelarAgendamento,
};
