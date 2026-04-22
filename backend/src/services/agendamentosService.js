const prisma = require('../lib/prisma');

async function criarPeloSite({ nome, telefone, consultaId }) {
  const consulta = await prisma.consulta.findUnique({
    where: { id: consultaId },
    include: { medico: { include: { especialidade: true } } },
  });

  if (!consulta) {
    const err = new Error('Horário não encontrado.');
    err.status = 404;
    throw err;
  }

  if (consulta.status !== 'disponivel') {
    const err = new Error('Este horário não está mais disponível. Por favor, escolha outro.');
    err.status = 409;
    throw err;
  }

  const atualizado = await prisma.consulta.update({
    where: { id: consultaId },
    data: { pacienteNome: nome, telefone, status: 'agendado' },
    include: { medico: { include: { especialidade: true } } },
  });

  return {
    id: atualizado.id,
    pacienteNome: atualizado.pacienteNome,
    telefone: atualizado.telefone,
    data: atualizado.data,
    hora: atualizado.hora,
    medico: atualizado.medico.nome,
    especialidade: atualizado.medico.especialidade.nome,
    status: atualizado.status,
  };
}

async function buscarPorTelefone(telefone) {
  const consultas = await prisma.consulta.findMany({
    where: { telefone, status: 'agendado' },
    include: { medico: { include: { especialidade: true } } },
    orderBy: [{ data: 'asc' }, { hora: 'asc' }],
  });

  return consultas.map((c) => ({
    id: c.id,
    pacienteNome: c.pacienteNome,
    telefone: c.telefone,
    data: c.data,
    hora: c.hora,
    medico: c.medico.nome,
    especialidade: c.medico.especialidade.nome,
    status: c.status,
  }));
}

async function cancelar(id) {
  const consulta = await prisma.consulta.findUnique({ where: { id } });

  if (!consulta) {
    const err = new Error('Agendamento não encontrado.');
    err.status = 404;
    throw err;
  }

  if (consulta.status !== 'agendado') {
    const err = new Error('Este agendamento não pode ser cancelado.');
    err.status = 400;
    throw err;
  }

  const atualizado = await prisma.consulta.update({
    where: { id },
    data: { pacienteNome: null, telefone: null, status: 'disponivel' },
  });

  return { id: atualizado.id, data: atualizado.data, hora: atualizado.hora };
}

async function criarViaWebhook({ nome, telefone, data, hora, tipoConsulta }) {
  const where = { status: 'disponivel', data, hora };

  if (tipoConsulta) {
    const especialidade = await prisma.especialidade.findFirst({
      where: { nome: tipoConsulta },
    });
    if (!especialidade) return null;

    const medicos = await prisma.medico.findMany({
      where: { especialidadeId: especialidade.id },
    });
    where.medicoId = { in: medicos.map((m) => m.id) };
  }

  const slotDisponivel = await prisma.consulta.findFirst({
    where,
    include: { medico: { include: { especialidade: true } } },
  });

  if (!slotDisponivel) {
    return null;
  }

  const atualizado = await prisma.consulta.update({
    where: { id: slotDisponivel.id },
    data: { pacienteNome: nome, telefone, status: 'agendado' },
    include: { medico: { include: { especialidade: true } } },
  });

  return {
    id: atualizado.id,
    pacienteNome: atualizado.pacienteNome,
    telefone: atualizado.telefone,
    data: atualizado.data,
    hora: atualizado.hora,
    medico: atualizado.medico.nome,
    especialidade: atualizado.medico.especialidade.nome,
    status: atualizado.status,
  };
}

module.exports = { criarPeloSite, buscarPorTelefone, cancelar, criarViaWebhook };
