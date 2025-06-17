const apiUrl = '/tasks';
let currentFilter = 'all';

function formatTanggalIndonesia(date) {
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][date.getDay()];
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][date.getMonth()];
  return `${hari}, ${date.getDate()} ${bulan} ${date.getFullYear()}`;
}

async function loadTasks() {
  const res = await fetch(apiUrl);
  const tasks = await res.json();
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  const filtered = tasks.filter(task => {
    if (currentFilter === 'done') return task.done;
    if (currentFilter === 'undone') return !task.done;
    return true;
  });

  filtered.forEach((task, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="flex-grow:1">
        <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleDone(${i})" />
        <span contenteditable="true" onblur="editTask(${i}, this)" style="margin-left:8px; ${task.done ? 'text-decoration: line-through; color:gray;' : ''}">
          ${task.text}
        </span><br/>
        <small><em>${task.date}</em></small>
      </div>
      <button onclick="deleteTask(${i})">Hapus</button>
    `;
    list.appendChild(li);
  });
}

async function addTask(e) {
  e.preventDefault();
  const input = document.getElementById('taskInput');
  const task = {
    text: input.value.trim(),
    done: false,
    date: formatTanggalIndonesia(new Date())
  };
  if (!task.text) return alert('Tugas tidak boleh kosong');
  await fetch(apiUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(task)
  });
  input.value = '';
  loadTasks();
}

async function deleteTask(i) {
  await fetch(`${apiUrl}/${i}`, { method: 'DELETE' });
  loadTasks();
}

async function toggleDone(i) {
  const res = await fetch(apiUrl);
  const tasks = await res.json();
  const updated = { done: !tasks[i].done };
  await fetch(`${apiUrl}/${i}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated)
  });
  loadTasks();
}

async function editTask(i, el) {
  const text = el.innerText.trim();
  if (!text) return alert('Tugas tidak boleh kosong');
  await fetch(`${apiUrl}/${i}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
}

function setFilter(f) {
  currentFilter = f;
  loadTasks();
}

document.getElementById('taskForm').addEventListener('submit', addTask);
loadTasks();
