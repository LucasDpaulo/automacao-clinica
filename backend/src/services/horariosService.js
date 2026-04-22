const prisma = require('../lib/prisma');

async function buscarDisponiveis({ data, especialidade }) {
  const where = { status: 'disponivel' };

  if (data) where.data = data;

  if (especialidade) {
    const esp = await prisma.especialidade.findFirst({ where: { nome: especialidade } });
    if (esp) {
      const medicos = await prisma.medico.findMany({ where: { especialidadeId: esp.id } });
      where.medicoId = { in: medicos.map((m) => m.id) };
    }
  }

  const consultas = await prisma.consulta.findMany({
    where,
    include: {
      medico: {
        include: { especialidade: true },
      },
    },
    orderBy: [{ data: 'asc' }, { hora: 'asc' }],
  });

  return consultas.map((c) => ({
    id: c.id,
    data: c.data,
    hora: c.hora,
    medico: c.medico.nome,
    especialidade: c.medico.especialidade.nome,
  }));
}

module.exports = { buscarDisponiveis };
