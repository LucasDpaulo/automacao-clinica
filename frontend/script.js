const API_URL = 'http://localhost:3000/api';
const WHATSAPP_NUMERO = '5511999999999';
const WHATSAPP_TEXTO = 'Olá! Gostaria de agendar uma consulta na DentalCare.';

document.addEventListener('DOMContentLoaded', () => {
  configurarWhatsApp();
  configurarDataMinima();
  carregarEspecialidades();

  document.getElementById('especialidade').addEventListener('change', tentarCarregarHorarios);
  document.getElementById('data').addEventListener('change', tentarCarregarHorarios);
  document.getElementById('formAgendamento').addEventListener('submit', handleAgendamento);
});

function configurarWhatsApp() {
  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_TEXTO)}`;
  document.querySelectorAll('.btn-whatsapp').forEach((btn) => {
    btn.href = url;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
  });
}

function configurarDataMinima() {
  const dataInput = document.getElementById('data');
  const hoje = new Date().toISOString().split('T')[0];
  dataInput.min = hoje;
}

async function carregarEspecialidades() {
  const select = document.getElementById('especialidade');
  try {
    const res = await fetch(`${API_URL}/especialidades`);
    if (!res.ok) throw new Error('Erro ao buscar especialidades');
    const especialidades = await res.json();

    select.innerHTML = '<option value="">Selecione a especialidade</option>';
    especialidades.forEach((esp) => {
      const opt = document.createElement('option');
      opt.value = esp.nome;
      opt.textContent = esp.nome;
      select.appendChild(opt);
    });
  } catch (err) {
    select.innerHTML = '<option value="">Erro ao carregar. Tente recarregar a página.</option>';
    console.error('Erro ao carregar especialidades:', err);
  }
}

async function tentarCarregarHorarios() {
  const data = document.getElementById('data').value;
  const especialidade = document.getElementById('especialidade').value;
  const horarioSelect = document.getElementById('horario');

  if (!data || !especialidade) {
    horarioSelect.innerHTML = '<option value="">Selecione especialidade e data primeiro</option>';
    return;
  }

  horarioSelect.innerHTML = '<option value="">Carregando horários...</option>';

  try {
    const params = new URLSearchParams({ data, especialidade });
    const res = await fetch(`${API_URL}/horarios?${params}`);
    if (!res.ok) throw new Error('Erro ao buscar horários');
    const horarios = await res.json();

    if (horarios.length === 0) {
      horarioSelect.innerHTML = '<option value="">Nenhum horário disponível nesta data</option>';
      return;
    }

    horarioSelect.innerHTML = '<option value="">Selecione um horário</option>';
    horarios.forEach((h) => {
      const opt = document.createElement('option');
      opt.value = h.id;
      opt.textContent = `${h.hora} — ${h.medico}`;
      horarioSelect.appendChild(opt);
    });
  } catch (err) {
    horarioSelect.innerHTML = '<option value="">Erro ao carregar horários</option>';
    console.error('Erro ao carregar horários:', err);
  }
}

async function handleAgendamento(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const consultaId = document.getElementById('horario').value;
  const btn = document.getElementById('btnAgendar');

  if (!nome || !telefone || !consultaId) {
    mostrarMensagem('Por favor, preencha todos os campos e selecione um horário.', 'erro');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Agendando...';

  try {
    const res = await fetch(`${API_URL}/agendamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, telefone, consultaId: parseInt(consultaId) }),
    });

    const data = await res.json();

    if (res.ok && data.sucesso) {
      mostrarMensagem(data.mensagem, 'sucesso');
      document.getElementById('formAgendamento').reset();
      document.getElementById('horario').innerHTML = '<option value="">Selecione especialidade e data primeiro</option>';
    } else {
      mostrarMensagem(data.mensagem || 'Erro ao agendar. Tente novamente.', 'erro');
    }
  } catch (err) {
    mostrarMensagem('Erro de conexão com o servidor. Verifique se o backend está rodando.', 'erro');
    console.error('Erro ao agendar:', err);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Confirmar Agendamento';
  }
}

function mostrarMensagem(texto, tipo) {
  const div = document.getElementById('mensagemResultado');
  div.style.display = 'block';
  div.className = `mensagem-resultado mensagem-${tipo}`;
  div.textContent = texto;
  setTimeout(() => { div.style.display = 'none'; }, 6000);
}
