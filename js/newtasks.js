document.addEventListener("DOMContentLoaded", () => {
  const KEY = 'tasks_v1';

  const pendingTitle = document.querySelector(".badge--blue");
  const doneTitle    = document.querySelector(".badge--green");
  const pendingList  = document.querySelector(".list ul:not(.done)");
  const doneList     = document.querySelector(".list .done");
  const radios       = document.querySelectorAll('input[name="filter"]');

  const load = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const save = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

  function render() {
    const tasks = load();
    pendingList.innerHTML = '';
    doneList.innerHTML = '';

    for (const t of tasks) {
      const li = document.createElement('li');
      li.dataset.id = t.id;
      if (t.done) li.classList.add('is-done');

      // IMPORTANTE: não envolver tudo num <label> para não marcar o checkbox ao clicar no texto
      li.style.display = 'block';
      li.innerHTML = `
        <div class="row">
          <input type="checkbox" ${t.done ? 'checked' : ''} aria-label="Concluir tarefa">
          <span class="task-text" role="button" tabindex="0">${escapeHtml(t.title)}</span>
        </div>
      `;

      const cb = li.querySelector('input[type="checkbox"]');
      const textBtn = li.querySelector('.task-text');

      // 1) Marcar/Desmarcar só quando clicar NO CHECKBOX
      cb.addEventListener('change', (e) => {
        const arr = load();
        const i = arr.findIndex(x => x.id === t.id);
        if (i >= 0) {
          arr[i].done = e.target.checked;
          save(arr);
          render();
        }
      });

      // 2) Clicar no texto → editar (sem marcar checkbox)
      function goEdit(e) {
        e.preventDefault();
        e.stopPropagation(); // evita que o clique “passe” pro checkbox/label
        // navega por ID
        window.location.href = 'edit-task.html?taskId=' + encodeURIComponent(t.id);
      }
      textBtn.addEventListener('click', goEdit);
      textBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') goEdit(e);
      });

      (t.done ? doneList : pendingList).appendChild(li);
    }

    applyFilter();
  }

  function escapeHtml(s){
    return s.replace(/[&<>"]/g, (c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
  }

  function applyFilter() {
    const val = document.querySelector('input[name="filter"]:checked').value;
    const showPending = (val === 'all' || val === 'pending');
    const showDone    = (val === 'all' || val === 'done');
    pendingTitle.style.display = showPending ? '' : 'none';
    pendingList.style.display  = showPending ? '' : 'none';
    doneTitle.style.display    = showDone ? '' : 'none';
    doneList.style.display     = showDone ? '' : 'none';
  }

  radios.forEach(r => r.addEventListener('change', applyFilter));
  render();
});

document.addEventListener('DOMContentLoaded', () => {
  // Seleciona todos os botões de prioridade
  const levels = document.querySelectorAll('.nivel');

  // Adiciona o comportamento de clique nos botões de prioridade
  levels.forEach(level => {
    level.addEventListener('click', () => {
      // Remove a classe 'is-active' de todos os botões
      levels.forEach(l => l.classList.remove('is-active'));
      // Adiciona a classe 'is-active' ao botão clicado
      level.classList.add('is-active');
    });
  });

  // Salvar a nova tarefa
  document.getElementById('new-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value.trim();
    const desc = document.getElementById('desc').value.trim();
    const date = document.getElementById('date').value || null;

    // Captura a prioridade selecionada
    const activeLevel = document.querySelector('.nivel.is-active');
    const prio = activeLevel ? activeLevel.dataset.level : null;

    // Salvar no localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks_v1') || '[]');
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2,7); // ID único
    tasks.push({ id, title, desc, date, prio, done: false });
    localStorage.setItem('tasks_v1', JSON.stringify(tasks));

    // Redireciona de volta para a lista de tarefas
    location.href = 'mytasks.html';
  });
});
