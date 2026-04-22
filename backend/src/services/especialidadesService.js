const prisma = require('../lib/prisma');

async function listar() {
  return prisma.especialidade.findMany({
    orderBy: { nome: 'asc' },
  });
}

module.exports = { listar };
