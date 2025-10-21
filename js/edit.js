function getParam(name){ return new URL(location.href).searchParams.get(name); }

document.addEventListener('DOMContentLoaded', () => {
  const KEY='tasks_v1';
  const id = getParam('taskId');  // <— agora por id
  const tasks = JSON.parse(localStorage.getItem(KEY) || '[]');
  const idx = tasks.findIndex(t => t.id === id);
  if (idx < 0) { location.href='mytasks.html'; return; }

  const t = tasks[idx];
  // preencher campos
  document.getElementById('title').value = t.title;
  document.getElementById('desc').value  = t.desc || '';
  if (t.date) document.getElementById('date').value = t.date;

  // salvar
  document.getElementById('new-form').addEventListener('submit', (e) => {
    e.preventDefault();
    t.title = document.getElementById('title').value.trim();
    t.desc  = document.getElementById('desc').value.trim();
    t.date  = document.getElementById('date').value || null;
    localStorage.setItem(KEY, JSON.stringify(tasks));
    location.href='mytasks.html';
  });
});

function getParam(name){ return new URL(location.href).searchParams.get(name); }

document.addEventListener('DOMContentLoaded', () => {
  const KEY='tasks_v1';
  const id = getParam('taskId');
  if (!id) { location.href='mytasks.html'; return; }

  const titleEl = document.getElementById('task-title');
  const titleInput = document.getElementById('title') || document.getElementById('title-input');
  const descEl  = document.getElementById('desc');
  const dateEl  = document.getElementById('date');

  const tasks = JSON.parse(localStorage.getItem(KEY) || '[]');
  const idx = tasks.findIndex(t => t.id === id);
  if (idx < 0) { location.href='mytasks.html'; return; }

  const t = tasks[idx];

  // preencher
  titleEl && (titleEl.textContent = t.title || 'Tarefa');
  if (titleInput) titleInput.value = t.title || '';
  if (descEl) descEl.value = t.desc || '';
  if (dateEl && t.date) dateEl.value = t.date;

  // prioridade (se tiver chips, marque aqui)
  // exemplo:
  // if (t.prio) document.querySelector(`.chip[data-prio="${t.prio}"]`)?.classList.add('is-active');

  // salvar
  const form = document.getElementById('new-form') || document.getElementById('edit-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = (titleInput?.value || '').trim();
    if (!title) { alert('Informe um título.'); return; }

    t.title = title;
    t.desc  = descEl ? descEl.value.trim() : '';
    t.date  = dateEl ? (dateEl.value || null) : null;
    // t.prio = ...

    tasks[idx] = t;
    localStorage.setItem(KEY, JSON.stringify(tasks));
    location.href = 'mytasks.html';
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'tasks_v1';
  const id = new URL(location.href).searchParams.get('taskId');
  const tasks = JSON.parse(localStorage.getItem(KEY) || '[]');
  const idx = tasks.findIndex(t => t.id === id);

  if (idx < 0) {
    location.href = 'mytasks.html'; // caso não encontre o ID
    return;
  }

  const task = tasks[idx];

  // preenchendo o formulário com os dados da tarefa
  document.getElementById('title-input').value = task.title;
  document.getElementById('desc').value = task.desc || '';
  if (task.date) document.getElementById('date').value = task.date;

  // Prioridade - clique nos botões
  const levels = document.querySelectorAll('.nivel');
  levels.forEach(level => {
    level.addEventListener('click', () => {
      // Desmarcar todos os botões
      levels.forEach(l => l.classList.remove('is-active'));
      // Adicionar a classe 'is-active' ao botão clicado
      level.classList.add('is-active');
    });

    // Verifica a prioridade salva e ativa o botão correspondente
    if (task.prio && level.dataset.level == task.prio) {
      level.classList.add('is-active');
    }
  });

  // salvar os dados no localStorage
  document.getElementById('edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // captura as informações
    task.title = document.getElementById('title-input').value.trim();
    task.desc = document.getElementById('desc').value.trim();
    task.date = document.getElementById('date').value || null;
    
    // captura a prioridade
    const activeLevel = document.querySelector('.nivel.is-active');
    task.prio = activeLevel ? activeLevel.dataset.level : null;

    // salva a tarefa de volta no localStorage
    tasks[idx] = task;
    localStorage.setItem(KEY, JSON.stringify(tasks));

    // volta para a lista de tarefas
    location.href = 'mytasks.html';
  });
});

