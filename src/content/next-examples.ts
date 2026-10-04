/** Reading companions: split snippets at file comments in a local App Router project. */
export const nextExamples: Record<string, string> = {
  'next-file-routing': `// app/learn/page.tsx → /learn
export default function LearnPage() {
  return <main><h1>Learning library</h1></main>;
}
// app/learn/react/page.tsx → /learn/react
export default function ReactPage() {
  return <main><h1>React lessons</h1></main>;
}`,
  'next-layouts-dynamic': `// app/learn/layout.tsx
import Link from "next/link";
export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <><nav><Link href="/learn">Library</Link></nav>{children}</>;
}
// app/learn/[slug]/page.tsx
export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <main><h1>Lesson: {slug}</h1></main>;
}
// Keep the generated app/layout.tsx with its html and body elements.`,
  'next-link-navigation': `// app/page.tsx
import Link from "next/link";
export default function Page() {
  return <main><h1>My learning</h1><Link href="/learn">Browse lessons</Link></main>;
}
// app/learn/page.tsx
import Link from "next/link";
export default function LearnPage() {
  return <main><h1>Lessons</h1><Link href="/">Back to dashboard</Link></main>;
}`,
  'next-route-groups': `// app/(learning)/layout.tsx — parentheses stay out of the URL
export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return <section aria-label="Learning workspace">{children}</section>;
}
// app/(learning)/learn/page.tsx → /learn
export default function LearnPage() { return <h1>Learning workspace</h1>; }
// Keep app/layout.tsx as the root layout. Do not also create app/learn/page.tsx.`,
  'next-not-found': `// app/learn/[slug]/page.tsx
import { notFound } from "next/navigation";
const lessons = [{ slug: "react", title: "React" }];
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = lessons.find(item => item.slug === slug);
  if (!lesson) notFound();
  return <h1>{lesson.title}</h1>;
}
// app/learn/[slug]/not-found.tsx
import Link from "next/link";
export default function MissingLesson() {
  return <main><h1>Lesson not found</h1><Link href="/learn/react">Open React</Link></main>;
}`,
  'next-server-components': `// app/page.tsx — Server Component; no use client directive
async function getLessons() {
  // Replace this synthetic read with your server data adapter.
  return [{ id: "react", title: "React" }];
}
export default async function Page() {
  const lessons = await getLessons();
  return <ul>{lessons.map(lesson => <li key={lesson.id}>{lesson.title}</li>)}</ul>;
}
// Keep credentials inside server-only modules; return only public fields to the UI.`,
  'next-client-components': `// app/Menu.tsx
"use client";
import { useState } from "react";
export default function Menu() {
  const [open, setOpen] = useState(false);
  return <section><button aria-expanded={open} onClick={() => setOpen(value => !value)}>Lessons</button>
    {open && <p>Choose your next lesson.</p>}</section>;
}
// app/page.tsx — keep surrounding content on the server
import Menu from "./Menu";
export default function Page() { return <main><h1>Dashboard</h1><Menu /></main>; }
// Client Components can also be prerendered on the server before hydration.`,
  'next-streaming-suspense': `// app/page.tsx
import { Suspense } from "react";
import { connection } from "next/server";
async function Progress() {
  await connection(); // Render this section at request time.
  await new Promise(resolve => setTimeout(resolve, 1000));
  return <p>Three lessons completed.</p>;
}
export default function Page() {
  return <main><h1>Your learning</h1>
    <Suspense fallback={<p role="status">Loading progress…</p>}><Progress /></Suspense>
  </main>;
}`,
  'next-caching-revalidation': `// app/page.tsx — default App Router configuration, Cache Components disabled
export default async function Page() {
  // Explicitly opt this public read into a 60-second cache.
  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error("Public lesson request failed");
  const lesson = await response.json();
  if (typeof lesson.title !== "string") throw new Error("Unexpected lesson data");
  return <h1>{lesson.title}</h1>;
}
// fetch does not cache responses by default. no-store requests fresh data.
// With Cache Components enabled, use its use cache/cacheLife APIs instead.`,
  'next-server-actions': `// app/actions.ts
"use server";
import { cookies } from "next/headers";
export async function saveGoal(_: { error: string; message: string }, formData: FormData) {
  const raw = formData.get("goal");
  const goal = typeof raw === "string" ? raw.trim() : "";
  if (!goal || goal.length > 80) return { error: "Use a goal of 1–80 characters", message: "" };
  const store = await cookies();
  store.set("study-goal", goal, { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" });
  // This is a personal preference, not an authenticated database write.
  return { error: "", message: "Goal saved" };
}
// app/GoalForm.tsx
"use client";
import { useActionState } from "react";
import { saveGoal } from "./actions";
export default function GoalForm() {
  // useActionState passes the previous state first, then the submitted FormData.
  const [state, action, pending] = useActionState(saveGoal, { error: "", message: "" });
  return <form action={action}><label htmlFor="goal">Study goal</label>
    <input id="goal" name="goal" required maxLength={80} aria-invalid={!!state.error} aria-describedby="goal-feedback" />
    <p id="goal-feedback" role="status">{state.error || state.message}</p>
    <button disabled={pending}>{pending ? "Saving…" : "Save goal"}</button></form>;
}
// app/page.tsx
import GoalForm from "./GoalForm";
export default function Page() {
  return <main><h1>Learning goal</h1><GoalForm /></main>;
}
// Sensitive actions also require server-side identity and permission checks.`,
  'next-data-fetching': `// app/page.tsx
import { connection } from "next/server";
export default async function Page({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  await connection();
  const { demo } = await searchParams;
  await new Promise(resolve => setTimeout(resolve, 600));
  if (demo === "error") throw new Error("Synthetic load failure");
  const lessons = demo === "empty" ? [] : [{ id: "react", title: "React" }];
  if (!lessons.length) return <main><h1>Your lessons</h1><p>No lessons yet. Add your first learning goal.</p></main>;
  return <main><h1>Your lessons</h1><ul>{lessons.map(item => <li key={item.id}>{item.title}</li>)}</ul></main>;
}
// Add loading.tsx and error.tsx using the corresponding lessons below.`,
  'next-metadata-route-handlers': `// app/page.tsx
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Learning dashboard", description: "Plan your next lesson." };
export default function Page() { return <h1>Learning dashboard</h1>; }
// app/api/greeting/route.ts
export async function GET(request: Request) {
  const name = new URL(request.url).searchParams.get("name")?.trim();
  if (!name || name.length > 40) return Response.json({ error: "Use a name of 1–40 characters" }, { status: 400 });
  return Response.json({ greeting: "Hello, " + name });
}
// The endpoint is public and only returns a synthetic greeting.`,
  'next-loading-ui': `// app/learn/loading.tsx — automatically wraps this segment in Suspense
export default function Loading() {
  return <main aria-busy="true"><h1>Lessons</h1><p role="status">Loading your lesson list…</p></main>;
}
// app/learn/page.tsx
import { connection } from "next/server";
export default async function Page() {
  await connection();
  await new Promise(resolve => setTimeout(resolve, 1200));
  return <main><h1>Lessons</h1><p>React is ready to study.</p></main>;
}`,
  'next-error-ui': `// app/learn/error.tsx
"use client";
export default function ErrorView({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main><h1>Lessons could not load</h1><p>Try loading this section again.</p><button onClick={() => reset()}>Try again</button></main>;
}
// app/learn/page.tsx
import { connection } from "next/server";
export default async function Page() {
  await connection();
  if (Math.random() < 0.5) throw new Error("Synthetic lesson failure");
  return <h1>Lessons ready</h1>;
}
// Use deterministic test fixtures in real tests. error.tsx does not catch its same-segment layout.`,
  'next-fonts-images': `// app/layout.tsx
import { Geist } from "next/font/google";
const geist = Geist({ subsets: ["latin"] });
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className={geist.className}>{children}</body></html>;
}
// app/page.tsx — add your own 1200×800 image at public/study.jpg
import Image from "next/image";
export default function Page() {
  return <main><h1>Study space</h1><Image src="/study.jpg" alt="A desk ready for studying" width={1200} height={800} style={{ width: "100%", height: "auto" }} /></main>;
}`,
  'next-forms-validation': `// app/actions.ts
"use server";
export type FormState = { error: string; message: string };
export async function validateEmail(_: FormState, formData: FormData): Promise<FormState> {
  const raw = formData.get("email");
  const email = typeof raw === "string" ? raw.trim() : "";
  // Lesson rule: one @, no whitespace, and a dotted domain. Not a full email standard parser.
  if (email.length > 254 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    return { error: "Enter an email such as learner@example.com", message: "" };
  }
  return { error: "", message: "Email passes the lesson rule; no subscription was created." };
}
// app/EmailForm.tsx
"use client";
import { useActionState } from "react";
import { validateEmail } from "./actions";
export default function EmailForm() {
  const [state, action, pending] = useActionState(validateEmail, { error: "", message: "" });
  return <form action={action}><label htmlFor="email">Email</label>
    <input id="email" name="email" type="email" required aria-invalid={!!state.error} aria-describedby="email-feedback" />
    <p id="email-feedback" role="status">{state.error || state.message}</p><button disabled={pending}>{pending ? "Checking…" : "Check email"}</button></form>;
}
// app/page.tsx
import EmailForm from "./EmailForm";
export default function Page() { return <main><h1>Check an email</h1><EmailForm /></main>; }`,
  'next-optimistic-ui': `// app/actions.ts
"use server";
import { cookies } from "next/headers";
export async function saveBookmark(saved: boolean) {
  if (typeof saved !== "boolean") throw new Error("Invalid bookmark value");
  await new Promise(resolve => setTimeout(resolve, 700));
  (await cookies()).set("study-bookmark", String(saved), { httpOnly: true, sameSite: "lax", path: "/" });
  return saved;
}
// app/Bookmark.tsx
"use client";
import { useOptimistic, useState, useTransition } from "react";
import { saveBookmark } from "./actions";
export default function Bookmark({ initialSaved }: { initialSaved: boolean }) {
  const [saved, setSaved] = useState(initialSaved);
  const [optimistic, setOptimistic] = useOptimistic(saved);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  function toggle() {
    const next = !saved;
    startTransition(async () => {
      setError(""); setOptimistic(next);
      try { const confirmed = await saveBookmark(next); startTransition(() => setSaved(confirmed)); }
      catch { setError("Could not save. Your previous bookmark was restored."); }
    });
  }
  return <><button disabled={pending} aria-pressed={optimistic} onClick={toggle}>{optimistic ? "Saved" : "Save"}</button><p role="status">{error || (pending ? "Saving…" : "Ready")}</p></>;
}
// app/page.tsx
import { cookies } from "next/headers";
import Bookmark from "./Bookmark";
export default async function Page() {
  const initialSaved = (await cookies()).get("study-bookmark")?.value === "true";
  return <main><h1>React lesson</h1><Bookmark initialSaved={initialSaved} /></main>;
}`,
  'next-revalidate-path': `// Default App Router configuration, Cache Components disabled.
// app/learn/page.tsx — public synthetic cached data
import { unstable_cache } from "next/cache";
const readVersion = unstable_cache(async () => new Date().toISOString(), ["demo-version"], { revalidate: 3600 });
export default async function Page() { return <p>Cached version: {await readVersion()}</p>; }
// app/actions.ts
"use server";
import { revalidatePath } from "next/cache";
export async function refreshDemo() {
  revalidatePath("/learn"); // Demonstrates invalidation; this example has no database write.
}
// app/page.tsx
import Link from "next/link";
import { refreshDemo } from "./actions";
export default function Page() { return <><form action={refreshDemo}><button>Invalidate demo cache</button></form><Link href="/learn">View cached version</Link></>; }
// For real writes: validate, authorize, await the write, then invalidate its dependent path.`,
  'next-auth-boundaries': `// app/api/publish/route.ts — isolated synthetic demo; not production authentication
async function verifiedDemoSession() { return { id: "demo", role: "reader" }; }
export async function POST(request: Request) {
  const actor = await verifiedDemoSession(); // Replace with your verified server session adapter.
  if (!actor) return Response.json({ error: "Sign in first" }, { status: 401 });
  if (actor.role !== "editor") return Response.json({ error: "Publishing is not permitted" }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!body || typeof body !== "object" || !("title" in body) || typeof body.title !== "string" || !body.title.trim()) {
    return Response.json({ error: "A title is required" }, { status: 400 });
  }
  return Response.json({ message: "Authorized demo request; nothing was published" });
}
// Never obtain the actor's trusted role from the request body.`,
  'next-route-handlers': `// app/api/lessons/route.ts — public synthetic validation endpoint
export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!body || typeof body !== "object" || !("title" in body) || typeof body.title !== "string") {
    return Response.json({ error: "A string title is required" }, { status: 400 });
  }
  const title = body.title.trim();
  if (!title || title.length > 80) return Response.json({ error: "Use 1–80 characters" }, { status: 400 });
  return Response.json({ title, validated: true });
}
// A sensitive write must also verify identity and permission before changing data.`,
  'next-code-splitting': `// app/EditorPanel.tsx
"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
const Editor = dynamic(() => import("./Editor"), { loading: () => <p role="status">Loading editor…</p> });
export default function EditorPanel() {
  const [open, setOpen] = useState(false);
  return <><button onClick={() => setOpen(value => !value)} aria-expanded={open}>Toggle notes</button>{open && <Editor />}</>;
}
// app/Editor.tsx
"use client";
export default function Editor() { return <label>Notes<textarea /></label>; }
// app/page.tsx
import EditorPanel from "./EditorPanel";
export default function Page() { return <main><h1>Study notes</h1><EditorPanel /></main>; }
// The small textarea stands in for an optional heavy editor dependency.`,
  'next-client-boundaries': `// app/page.tsx — server-owned public data and layout
import CompletionButton from "./CompletionButton";
export default function Page() {
  const lesson = { title: "React state", minutes: 8 };
  return <main><h1>{lesson.title}</h1><p>{lesson.minutes} minutes</p><CompletionButton /></main>;
}
// app/CompletionButton.tsx
"use client";
import { useState } from "react";
export default function CompletionButton() {
  const [done, setDone] = useState(false);
  return <button aria-pressed={done} onClick={() => setDone(value => !value)}>{done ? "Completed" : "Mark complete"}</button>;
}`,
  'next-seo-metadata': `// app/learn/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
const lessons = new Map([["react", "React state"], ["css", "CSS layout"]]);
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = lessons.get(slug);
  if (!title) notFound();
  return { title, description: "Study " + title + " with a focused example.", openGraph: { title, description: "Study " + title + "." } };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const title = lessons.get(slug);
  if (!title) notFound();
  return <h1>{title}</h1>;
}`,
  'next-web-vitals': `// app/Vitals.tsx
"use client";
import { useReportWebVitals } from "next/web-vitals";
export default function Vitals() {
  useReportWebVitals(metric => {
    // Local demonstration: production reporting needs a deliberate safe endpoint.
    console.info(metric.name, metric.value, metric.rating);
  });
  return null;
}
// app/layout.tsx
import Vitals from "./Vitals";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}<Vitals /></body></html>;
}`,
  'next-bundle-analysis': `// package.json: add @next/bundle-analyzer as a devDependency.
// next.config.ts — use next build --webpack with this analyzer
import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });
const config: NextConfig = {};
export default withBundleAnalyzer(config);
// Terminal: npm install --save-dev @next/bundle-analyzer
// PowerShell: $env:ANALYZE="true"; npx next build --webpack
// macOS/Linux: ANALYZE=true npx next build --webpack
// Compare client modules before and after moving eligible logic into Server Components.`,
  'next-environment-variables': `// .env.local — synthetic example; do not commit secrets
// STUDY_API_TOKEN=replace-with-a-local-demo-token
// NEXT_PUBLIC_HELP_URL=https://example.com/help
// app/api/config/route.ts
export async function GET() {
  const configured = Boolean(process.env.STUDY_API_TOKEN);
  return Response.json({ configured }); // Never send the token itself.
}
// app/HelpLink.tsx
"use client";
export default function HelpLink() {
  return <a href={process.env.NEXT_PUBLIC_HELP_URL || "https://example.com/help"}>Study help</a>;
}
// NEXT_PUBLIC_ values are inlined during the build and visible to everyone.`,
  'next-deployment-checklist': `// package.json scripts in a generated Next.js project
// "dev": "next dev", "build": "next build", "start": "next start"
// Terminal in your local project:
// npm run build
// npm run start
// Inspect /, /learn/react, an unknown lesson, and the empty/error demos.
// Confirm required environment variables in the target environment.
// Build success does not establish authorization, accessible interaction, or data validity.
// Stop the local production server with Ctrl+C after the checks.`,
  'next-observability': `// app/api/demo/route.ts
export async function GET() {
  const requestId = crypto.randomUUID();
  try {
    throw new Error("Synthetic data adapter failure");
  } catch {
    // Log controlled fields; do not log request bodies, cookies, or credentials.
    console.error({ event: "demo_read_failed", route: "/api/demo", requestId });
    return Response.json({ error: "Data is unavailable", requestId }, { status: 503 });
  }
}
// Match the safe requestId in the response with the server terminal entry.`,
  'next-security-headers': `// next.config.ts — baseline response headers; adapt to your application's needs
import type { NextConfig } from "next";
const config: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
    ] }];
  },
};
export default config;
// Headers supplement validation and server authorization; they do not replace them.
// DENY prevents framing: change it if your product intentionally supports embedding.`,
  'next-full-route-review': `// app/learn/page.tsx
import Link from "next/link";
export const metadata = { title: "Learning library", description: "Choose your next lesson." };
export default async function Page({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const { demo } = await searchParams;
  await new Promise(resolve => setTimeout(resolve, 600));
  if (demo === "error") throw new Error("Synthetic failure");
  const lessons = demo === "empty" ? [] : [{ slug: "react", title: "React" }];
  return <main><h1>Learning library</h1>{lessons.length
    ? <ul>{lessons.map(lesson => <li key={lesson.slug}><Link href={"/learn/" + lesson.slug}>{lesson.title}</Link></li>)}</ul>
    : <p>No lessons yet. Choose a topic to begin.</p>}</main>;
}
// Combine with [slug]/page.tsx, loading.tsx, error.tsx, and not-found.tsx from earlier examples.
// Review direct URLs, pending views, keyboard use, narrow screens, and document titles.`,
}
