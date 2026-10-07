export interface WorkspaceProjectFiles {
  html: string
  css: string
  js: string
}

export interface WorkspaceProjectState {
  version: 1
  files: WorkspaceProjectFiles
  git: { staged: boolean; committed: boolean; pushed: boolean }
}

export const starterWorkspaceFiles: WorkspaceProjectFiles = {
  html: '<main class="page">\n  <p class="eyebrow">A small start</p>\n  <h1>Build your first page</h1>\n  <p>Give this page a clear purpose, then make one useful change.</p>\n  <button id="try-button" type="button">Try the page</button>\n  <p id="message" role="status">Your page is ready.</p>\n</main>',
  css: '.page {\n  max-width: 38rem;\n  margin: 4rem auto;\n  padding: 2rem;\n}\n\nbutton {\n  padding: 0.7rem 1rem;\n  cursor: pointer;\n}',
  js: 'const button = document.querySelector("#try-button");\nconst message = document.querySelector("#message");\n\nbutton?.addEventListener("click", () => {\n  if (message) message.textContent = "Nice, your JavaScript is connected.";\n});',
}

export const starterWorkspaceFilesId: WorkspaceProjectFiles = {
  html: '<main class="page">\n  <p class="eyebrow">Langkah kecil</p>\n  <h1>Buat halaman pertamamu</h1>\n  <p>Tentukan tujuan halaman ini, lalu buat satu perubahan yang berguna.</p>\n  <button id="try-button" type="button">Coba halaman</button>\n  <p id="message" role="status">Halamanmu siap.</p>\n</main>',
  css: starterWorkspaceFiles.css,
  js: 'const button = document.querySelector("#try-button");\nconst message = document.querySelector("#message");\n\nbutton?.addEventListener("click", () => {\n  if (message) message.textContent = "Mantap, JavaScript-mu sudah terhubung.";\n});',
}

export const workspaceProjectStarter = JSON.stringify({
  version: 1,
  files: starterWorkspaceFiles,
  git: { staged: false, committed: false, pushed: false },
} satisfies WorkspaceProjectState)

export const workspaceProjectStarterId = JSON.stringify({
  version: 1,
  files: starterWorkspaceFilesId,
  git: { staged: false, committed: false, pushed: false },
} satisfies WorkspaceProjectState)

export const studySprintProjectStarter = `<style>
:root { color-scheme: light; font-family: system-ui, sans-serif; }
* { box-sizing: border-box; }
body { margin: 0; background: #eef4ef; color: #17261b; }
.sprint { width: min(100% - 2rem, 46rem); margin: 3rem auto; padding: 2rem; border-radius: 1.25rem; background: #fff; box-shadow: 0 18px 50px #17311d14; }
.sprint h1 { margin: .35rem 0; font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -.05em; }
.sprint p { color: #526258; }
.sprint form { display: flex; gap: .6rem; margin: 1.5rem 0; }
.sprint input { flex: 1; min-width: 0; padding: .75rem; border: 1px solid #bdcbbf; border-radius: .65rem; font: inherit; }
.sprint button { padding: .7rem .9rem; border: 0; border-radius: .65rem; background: #164b2b; color: white; font: inherit; cursor: pointer; }
.sprint button:focus-visible, .sprint input:focus-visible { outline: 3px solid #8bcf9b; outline-offset: 3px; }
.sprint ul { display: grid; gap: .6rem; padding: 0; list-style: none; }
.sprint li { display: flex; align-items: center; gap: .7rem; padding: .8rem; border: 1px solid #dce6dd; border-radius: .75rem; }
.sprint li button { margin-left: auto; background: #e7f2e8; color: #164b2b; }
.sprint .done span { color: #718075; text-decoration: line-through; }
.sprint [role="status"] { min-height: 1.5em; }
</style>
<main class="sprint">
  <p>STUDY SPRINT · A SMALL PLAN FOR TODAY</p>
  <h1>Choose one thing to finish</h1>
  <p>Add a task, make progress, and keep the next step clear.</p>
  <form id="task-form">
    <label class="sr-only" for="task-input">New study task</label>
    <input id="task-input" name="task" placeholder="For example, build a profile card" required>
    <button type="submit">Add task</button>
  </form>
  <p id="task-status" role="status">2 small steps are ready.</p>
  <ul id="task-list"></ul>
</main>
<script>
const tasks = [
  { id: 1, title: "Sketch the first screen", done: false },
  { id: 2, title: "Try one keyboard check", done: true },
];
const list = document.querySelector("#task-list");
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const status = document.querySelector("#task-status");
function render() {
  if (!list || !status) return;
  list.replaceChildren(...tasks.map(task => {
    const item = document.createElement("li");
    item.className = task.done ? "done" : "";
    const title = document.createElement("span");
    title.textContent = task.title;
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.textContent = task.done ? "Reopen" : "Complete";
    toggle.setAttribute("aria-label", (task.done ? "Reopen " : "Complete ") + task.title);
    toggle.addEventListener("click", () => { task.done = !task.done; render(); });
    item.append(title, toggle);
    return item;
  }));
  const remaining = tasks.filter(task => !task.done).length;
  status.textContent = tasks.length ? remaining + (remaining === 1 ? " task left." : " tasks left.") : "No tasks yet. Add one small step.";
}
form?.addEventListener("submit", event => {
  event.preventDefault();
  const title = input?.value.trim();
  if (!title) { status.textContent = "Write a task before adding it."; input?.focus(); return; }
  tasks.push({ id: Date.now(), title, done: false });
  if (input) input.value = "";
  render();
  input?.focus();
});
render();
</script>`

export const studySprintProjectStarterId = studySprintProjectStarter.replaceAll(
  'STUDY SPRINT · A SMALL PLAN FOR TODAY', 'STUDY SPRINT · RENCANA KECIL HARI INI',
).replaceAll('Choose one thing to finish', 'Pilih satu hal untuk diselesaikan')
  .replaceAll('Add a task, make progress, and keep the next step clear.', 'Tambahkan tugas, buat progres, dan jaga langkah berikutnya tetap jelas.')
  .replaceAll('New study task', 'Tugas belajar baru')
  .replaceAll('For example, build a profile card', 'Contoh: buat kartu profil')
  .replaceAll('Add task', 'Tambah tugas')
  .replaceAll('2 small steps are ready.', 'Ada 2 langkah kecil yang siap dikerjakan.')
  .replaceAll('Sketch the first screen', 'Sketsa layar pertama')
  .replaceAll('Try one keyboard check', 'Coba satu pemeriksaan keyboard')
  .replaceAll('Reopen', 'Buka lagi')
  .replaceAll('Complete', 'Selesaikan')
  .replaceAll(' task left.', ' tugas tersisa.')
  .replaceAll(' tasks left.', ' tugas tersisa.')
  .replaceAll('No tasks yet. Add one small step.', 'Belum ada tugas. Tambahkan satu langkah kecil.')
  .replaceAll('Write a task before adding it.', 'Tulis tugas sebelum menambahkannya.')

export const reactStudyListStarter = `import { useState } from "react";

const startingTasks = [
  { id: 1, title: "Sketch the first screen", done: false },
  { id: 2, title: "Try one keyboard check", done: true },
];

function TaskItem({ task, onToggle }) {
  return (
    <li className={task.done ? "done" : ""}>
      <span>{task.title}</span>
      <button type="button" onClick={() => onToggle(task.id)}>
        {task.done ? "Reopen" : "Complete"}
      </button>
    </li>
  );
}

export default function StudyList() {
  const [tasks, setTasks] = useState(startingTasks);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  function addTask(event) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) {
      setMessage("Write a task before adding it.");
      return;
    }
    setTasks(current => [...current, { id: Date.now(), title: nextTitle, done: false }]);
    setTitle("");
    setMessage("Task added.");
  }

  function toggleTask(id) {
    setTasks(current => current.map(task => task.id === id ? { ...task, done: !task.done } : task));
  }

  const remaining = tasks.filter(task => !task.done).length;
  return (
    <main className="study-list">
      <p className="eyebrow">A SMALL PLAN FOR TODAY</p>
      <h1>My study list</h1>
      <p>{remaining} {remaining === 1 ? "task" : "tasks"} left. Choose one useful next step.</p>
      <form onSubmit={addTask}>
        <label htmlFor="new-task">New study task</label>
        <div className="study-list-form">
          <input id="new-task" value={title} onChange={event => setTitle(event.target.value)} placeholder="For example, build a profile card" />
          <button type="submit">Add task</button>
        </div>
      </form>
      <p role="status">{message || (tasks.length ? "Your tasks are ready." : "No tasks yet. Add one small step.")}</p>
      {tasks.length ? <ul>{tasks.map(task => <TaskItem key={task.id} task={task} onToggle={toggleTask} />)}</ul> : <p className="empty-state">Your first task will show up here.</p>}
    </main>
  );
}`

export const reactStudyListStarterId = reactStudyListStarter
  .replace('Sketch the first screen', 'Sketsa layar pertama')
  .replace('Try one keyboard check', 'Coba satu pemeriksaan keyboard')
  .replace('A SMALL PLAN FOR TODAY', 'RENCANA KECIL HARI INI')
  .replace('My study list', 'Daftar belajarku')
  .replace('Choose one useful next step.', 'Pilih satu langkah berguna berikutnya.')
  .replace('Write a task before adding it.', 'Tulis tugas sebelum menambahkannya.')
  .replace('Task added.', 'Tugas ditambahkan.')
  .replace('New study task', 'Tugas belajar baru')
  .replace('For example, build a profile card', 'Contoh: buat kartu profil')
  .replace('Add task', 'Tambah tugas')
  .replace('Your tasks are ready.', 'Tugasmu siap dikerjakan.')
  .replace('No tasks yet. Add one small step.', 'Belum ada tugas. Tambahkan satu langkah kecil.')
  .replace('Your first task will show up here.', 'Tugas pertamamu akan muncul di sini.')
  .replace('task left.', 'tugas tersisa.')
  .replace('tasks left.', 'tugas tersisa.')
  .replace('Complete', 'Selesaikan')
  .replace('Reopen', 'Buka lagi')

export interface NextProjectState {
  version: 1
  route: 'dashboard' | 'project' | 'missing'
  dataState: 'loading' | 'success' | 'empty' | 'error'
  slug: string
  tasks: { id: number; title: string; done: boolean }[]
}

export const nextProjectStarter = JSON.stringify({
  version: 1,
  route: 'dashboard',
  dataState: 'success',
  slug: 'study-sprint',
  tasks: [{ id: 1, title: 'Review one lesson', done: false }, { id: 2, title: 'Build a small feature', done: true }],
} satisfies NextProjectState)

export const nextProjectStarterId = JSON.stringify({
  version: 1,
  route: 'dashboard',
  dataState: 'success',
  slug: 'study-sprint',
  tasks: [{ id: 1, title: 'Tinjau satu pelajaran', done: false }, { id: 2, title: 'Buat fitur kecil', done: true }],
} satisfies NextProjectState)
