/** Framework examples are reading companions to the executable JavaScript models. */
export const reactExamples: Record<string, string> = {
  'react-components': `function Profile({ name, role }) {
  return <article><h2>{name}</h2><p>{role}</p></article>;
}
export default function App() {
  return <Profile name="Ada" role="Learner" />;
}`,
  'react-jsx-props': `function LessonCard({ title, minutes }) {
  return <article><h2>{title}</h2><p>{minutes} minutes</p></article>;
}
export default function App() {
  return <LessonCard title="Learning props" minutes={7} />;
}`,
  'react-state-events': `import { useState } from "react";
export default function Counter() {
  // Hooks stay at the top level, before conditional returns.
  const [count, setCount] = useState(0);
  // Each handler sees its render's snapshot; the updater receives queued state.
  return <button onClick={() => setCount(current => current + 1)}>
    Count: {count}
  </button>;
}`,
  'react-lists-keys': `export default function TaskList({ tasks }) {
  return <ul>{tasks.map(task => <li key={task.id}>{task.title}</li>)}</ul>;
}`,
  'react-effects': `import { useEffect, useState } from "react";
export default function OnlineStatus() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return <p>{online ? "Online" : "Offline"}</p>;
}`,
  'react-composition-hooks': `import { useState } from "react";
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  return [on, () => setOn(value => !value)];
}
export default function Details() {
  const [open, toggle] = useToggle();
  return <section><button aria-expanded={open} onClick={toggle}>Details</button>
    {open && <p>Each useToggle call owns its own state.</p>}
  </section>;
}`,
  'react-conditional-rendering': `export default function Results({ items }) {
  if (items.length === 0) return <p>No results yet.</p>;
  return <ul>{items.map(item => <li key={item.id}>{item.title}</li>)}</ul>;
}`,
  'react-component-boundaries': `function ProfileHeader({ name }) { return <h1>{name}</h1>; }
function Biography({ text }) { return <p>{text}</p>; }
export default function Profile({ person }) {
  return <article><ProfileHeader name={person.name}/><Biography text={person.bio}/></article>;
}`,
  'react-styling-ui': `export default function Status({ done }) {
  return <p className={done ? "task task-complete" : "task"}>
    {done ? "Complete" : "Remaining"}
  </p>;
}`,
  'react-updating-objects': `import { useState } from "react";
export default function Profile() {
  const [person, setPerson] = useState({ name: "Ada", city: "Jakarta" });
  return <input aria-label="Name" value={person.name}
    onChange={event => setPerson(current => ({ ...current, name: event.target.value }))}/>;
}`,
  'react-updating-arrays': `import { useState } from "react";
export default function Tasks() {
  const [tasks, setTasks] = useState([{ id: "read", title: "Read", done: false }]);
  function toggle(id) {
    setTasks(current => current.map(task => task.id === id ? { ...task, done: !task.done } : task));
  }
  return <ul>{tasks.map(task => <li key={task.id}><button onClick={() => toggle(task.id)}>
    {task.title}: {task.done ? "done" : "remaining"}
  </button></li>)}</ul>;
}`,
  'react-controlled-inputs': `import { useState } from "react";
export default function Search() {
  const [query, setQuery] = useState("");
  return <label>Search<input value={query} onChange={event => setQuery(event.target.value)}/></label>;
}`,
  'react-refs': `import { useRef } from "react";
export default function FocusInput() {
  const input = useRef(null);
  return <><input ref={input} aria-label="Search"/><button onClick={() => input.current?.focus()}>Focus search</button></>;
}`,
  'react-effect-dependencies': `import { useEffect } from "react";
export default function PageTitle({ title }) {
  useEffect(() => { document.title = title; }, [title]);
  return <h1>{title}</h1>;
}`,
  'react-effect-cleanup': `import { useEffect, useState } from "react";
export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSeconds(value => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  return <p>{seconds} seconds</p>;
}`,
  'react-lifting-state': `import { useState } from "react";
function Input({ value, onChange }) { return <input aria-label="Shared name" value={value} onChange={event => onChange(event.target.value)}/>; }
export default function Parent() {
  const [name, setName] = useState("");
  return <><Input value={name} onChange={setName}/><p>Hello, {name}</p></>;
}`,
  'react-context': `import { createContext, useContext } from "react";
const ThemeContext = createContext("light");
function Label() { return <p>Theme: {useContext(ThemeContext)}</p>; }
export default function App() {
  return <ThemeContext.Provider value="dark"><Label/></ThemeContext.Provider>;
}`,
  'react-reducer': `import { useReducer } from "react";
function reducer(state, action) {
  if (action.type === "increment") return { count: state.count + 1 };
  if (action.type === "reset") return { count: 0 };
  return state;
}
export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return <button onClick={() => dispatch({ type: "increment" })}>{state.count}</button>;
}`,
  'react-derived-state': `export default function TaskSummary({ tasks }) {
  const remaining = tasks.filter(task => !task.done).length;
  return <p>{remaining} tasks remaining</p>;
}`,
  'react-memo': `import { useMemo } from "react";
export default function Results({ items, query }) {
  // Cache only when measurement shows this computation is expensive.
  const matches = useMemo(() => items.filter(item => item.title.includes(query)), [items, query]);
  return <p>{matches.length} matches</p>;
}`,
  'react-callbacks': `import { memo, useCallback, useState } from "react";
const AddButton = memo(function AddButton({ onAdd }) { return <button onClick={onAdd}>Add</button>; });
export default function Counter() {
  const [count, setCount] = useState(0);
  const add = useCallback(() => setCount(value => value + 1), []);
  return <><p>{count}</p><AddButton onAdd={add}/></>;
}`,
  'react-transitions': `import { useState, useTransition } from "react";
import { memo } from "react";
const MatchingTasks = memo(function MatchingTasks({ items, query }) {
  return <ul>{items.filter(item => item.title.includes(query)).map(item => <li key={item.id}>{item.title}</li>)}</ul>;
});
export default function Search({ items }) {
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  function change(event) {
    const value = event.target.value;
    setText(value);
    startTransition(() => setQuery(value));
  }
  return <><input aria-label="Search" value={text} onChange={change}/>
    <p role="status">{pending ? "Updating…" : "Ready"}</p>
    <MatchingTasks items={items} query={query}/>
  </>;
}`,
  'react-accessibility': `import { useId } from "react";
export default function EmailField() {
  const id = useId();
  return <><label htmlFor={id}>Email address</label><input id={id} type="email" required/></>;
}`,
  'react-form-validation': `import { useState } from "react";
export default function NameForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState(false);
  function submit(event) {
    event.preventDefault();
    const missing = !name.trim();
    setInvalid(missing);
    setMessage(missing ? "Enter a name." : "Ready to save; this demo has not written data.");
  }
  return <form onSubmit={submit}><label htmlFor="name">Name</label>
    <input id="name" value={name} onChange={event => setName(event.target.value)}
      aria-invalid={invalid} aria-describedby="name-feedback"/>
    <p id="name-feedback" role="status">{message}</p><button>Check name</button></form>;
}`,
  'react-request-states': `export default function Results({ state, onRetry }) {
  if (state.status === "idle") return <p>Choose a search to begin.</p>;
  if (state.status === "loading") return <p role="status">Loading…</p>;
  if (state.status === "error") return <section><p role="alert">Could not load the results.</p>
    {onRetry && <button onClick={onRetry}>Try again</button>}</section>;
  if (!state.items.length) return <p>No results yet.</p>;
  return <ul>{state.items.map(item => <li key={item.id}>{item.title}</li>)}</ul>;
}`,
  'react-error-boundaries': `import { Component } from "react";
export class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p role="alert">This panel could not open.</p> : this.props.children; }
}
// Wrap a child panel with <ErrorBoundary>...</ErrorBoundary>.
// Event-handler and asynchronous errors need their own handling.`,
  'react-testing-behavior': `// Behavior scenario for your test runner or a manual check:
// 1. Render <Counter /> with an initial count of 0.
// 2. Find the button by its accessible name.
// 3. Activate the button as a user would.
// 4. Check that the visible count is 1.
// Prefer observable behavior over checking internal variable names.`,
  'react-feature-architecture': `// features/tasks/TaskList.jsx
export function TaskList({ tasks, onToggle }) {
  return <ul>{tasks.map(task => <li key={task.id}>
    <button onClick={() => onToggle(task.id)}>{task.title}</button>
  </li>)}</ul>;
}
// The parent owns state; this view receives data and an intent callback.`,
  'react-preserving-state': `import { useState } from "react";
function Draft({ person }) {
  const [text, setText] = useState("");
  return <label>Message for {person.name}<input value={text} onChange={event => setText(event.target.value)}/></label>;
}
export default function Composer({ person }) {
  // Changing the key deliberately starts a new draft for the new person.
  return <Draft key={person.id} person={person}/>;
}`,
  'react-virtualized-lists': `// A simplified visible window, not a complete virtualizer.
export default function VisibleRows({ items, start, count }) {
  return <ul>{items.slice(start, start + count).map(item => <li key={item.id}>{item.title}</li>)}</ul>;
}
// A complete implementation also manages scroll geometry, overscan,
// keyboard navigation, and accessibility. Measure before adding it.`,
}
