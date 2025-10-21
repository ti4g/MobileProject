document.addEventListener("DOMContentLoaded", () => {
  const KEY = 'tasks_v1';

  const pendingTitle = document.querySelector(".badge--blue");
  const doneTitle    = document.querySelector(".badge--green");
  const pendingList  = document.querySelector(".list ul:not(.done)");
  const doneList     = document.querySelector(".list .done");
  const radios       = document.querySelectorAll('input[name="filter"]');

  // ===== Storage helpers =====
  const load = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const save = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

  // Se não há storage, importar do HTML atual (bootstrap)
  function bootstrapFromDOM() {
    const tasks = [];
    // pendentes
    pendingList.querySelectorAll('li').forEach(li => {
      const title = (li.textContent || '').trim();
      tasks.push({ id: genId(), title, desc: '', date: null, prio: null, done: false });
    });
    // concluídas
    doneList.querySelectorAll('li').forEach(li => {
      const t = li.textContent.replace(/\s+/g, ' ').trim();
      tasks.push({ id: genId(), title: t, desc: '', date: null, prio: null, done: true });
    });
    save(tasks);
    return tasks;
  }

  function genId(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

  // ===== Render =====
  function render() {
    const tasks = load();
    // limpa DOM
    pendingList.innerHTML = '';
    doneList.innerHTML = '';

    for (const t of tasks) {
      const li = document.createElement('li');
      li.dataset.id = t.id;
      li.className = t.done ? 'is-done' : '';

      li.innerHTML = `
        <label>
          <input type="checkbox" ${t.done ? 'checked' : ''}/>
          <span class="task-text">${escapeHtml(t.title)}</span>
        </label>
      `;

      // checkbox → alterna done e salva
      li.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
        const arr = load();
        const i = arr.findIndex(x => x.id === t.id);
        if (i >= 0) {
          arr[i].done = e.target.checked;
          save(arr);
          render();
        }
      });

      // clique no texto → editar (apenas se pendente)
      li.querySelector('.task-text').addEventListener('click', () => {
        // se quiser editar concluída também, remova o if
        if (!t.done) {
          window.location.href = 'editask.html?taskId=' + encodeURIComponent(t.id);
        }
      });

      (t.done ? doneList : pendingList).appendChild(li);
    }

    applyFilter();
  }

  function escapeHtml(s){
    return s.replace(/[&<>"]/g, (c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
  }

  // ===== Filtro =====
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

  // ===== Init =====
  let initial = load();
  if (!initial.length) { initial = bootstrapFromDOM(); }
  render();

  // Expor para páginas externas (edição) atualizarem e voltarem
  window.refreshTasks = render;
});
// Impede que clicar no texto da tarefa marque/desmarque o checkbox.
// Usa CAPTURA (3º argumento = true) para rodar antes do <label>.
function onTextToEdit(e) {
  const text = e.target.closest('.task-text');
  if (!text) return;

  // se o texto estiver dentro de um <label>, cancelar o toggle do checkbox
  if (text.closest('label')) {
    e.preventDefault();
  }
  e.stopPropagation();

  const li = text.closest('li');
  if (!li) return;

  const id = li.dataset.id;           // id salvo no render()
  // abrir editor por ID (não marca checkbox!)
  window.location.href = 'editask.html?taskId=' + encodeURIComponent(id);
}

// aplica nos dois blocos, em CAPTURA
document.querySelector('.list ul:not(.done)')
  .addEventListener('click', onTextToEdit, true);
document.querySelector('.list .done')
  .addEventListener('click', onTextToEdit, true);

  function onCheckboxChange(e) {
  const cb = e.target.closest('input[type="checkbox"]');
  if (!cb) return;
  const li = cb.closest('li');
  const id = li.dataset.id;

  const tasks = JSON.parse(localStorage.getItem('tasks_v1') || '[]');
  const i = tasks.findIndex(t => t.id === id);
  if (i >= 0) {
    tasks[i].done = cb.checked;
    localStorage.setItem('tasks_v1', JSON.stringify(tasks));
    // re-render se você usa render()
    // render();
  }
}

document.querySelector('.list ul:not(.done)').addEventListener('change', onCheckboxChange);
document.querySelector('.list .done').addEventListener('change', onCheckboxChange);
