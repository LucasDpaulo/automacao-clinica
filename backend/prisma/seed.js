require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function diasAFrente(dias) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().split('T')[0];
}

async function main() {
  await prisma.consulta.deleteMany();
  await prisma.medico.deleteMany();
  await prisma.especialidade.deleteMany();

  const clinico = await prisma.especialidade.create({ data: { nome: 'Clínico Geral' } });
  const periodontista = await prisma.especialidade.create({ data: { nome: 'Periodontista' } });
  const endodontista = await prisma.especialidade.create({ data: { nome: 'Endodontista' } });
  const ortodontista = await prisma.especialidade.create({ data: { nome: 'Ortodontista' } });
  const implantodontista = await prisma.especialidade.create({ data: { nome: 'Implantodontista' } });

  const drJoao = await prisma.medico.create({ data: { nome: 'Dr. João Silva', especialidadeId: clinico.id } });
  const draMaria = await prisma.medico.create({ data: { nome: 'Dra. Maria Souza', especialidadeId: periodontista.id } });
  const drCarlos = await prisma.medico.create({ data: { nome: 'Dr. Carlos Lima', especialidadeId: endodontista.id } });
  const draAna = await prisma.medico.create({ data: { nome: 'Dra. Ana Costa', especialidadeId: ortodontista.id } });
  const drPedro = await prisma.medico.create({ data: { nome: 'Dr. Pedro Rocha', especialidadeId: implantodontista.id } });

  await prisma.consulta.createMany({
    data: [
      { medicoId: drJoao.id,   data: diasAFrente(1), hora: '09:00', status: 'disponivel' },
      { medicoId: drJoao.id,   data: diasAFrente(1), hora: '10:00', status: 'disponivel' },
      { medicoId: drJoao.id,   data: diasAFrente(1), hora: '11:00', status: 'disponivel' },
      { medicoId: draMaria.id, data: diasAFrente(1), hora: '09:00', status: 'disponivel' },
      { medicoId: draMaria.id, data: diasAFrente(1), hora: '14:00', status: 'disponivel' },
      { medicoId: drCarlos.id, data: diasAFrente(2), hora: '10:00', status: 'disponivel' },
      { medicoId: drCarlos.id, data: diasAFrente(2), hora: '15:00', status: 'disponivel' },
      { medicoId: draAna.id,   data: diasAFrente(2), hora: '09:00', status: 'disponivel' },
      { medicoId: draAna.id,   data: diasAFrente(2), hora: '11:00', status: 'disponivel' },
      { medicoId: drPedro.id,  data: diasAFrente(3), hora: '10:00', status: 'disponivel' },
      { medicoId: drPedro.id,  data: diasAFrente(3), hora: '14:00', status: 'disponivel' },
      { medicoId: drJoao.id,   data: diasAFrente(3), hora: '16:00', status: 'disponivel' },
    ],
  });

  console.log('Banco populado com sucesso!');
  console.log(`Especialidades: 5 | Médicos: 5 | Horários disponíveis: 12`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
