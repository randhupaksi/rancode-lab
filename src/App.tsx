import { Route, Routes } from 'react-router-dom'

function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-10">
      <p className="mb-5 font-mono text-sm tracking-[0.18em] text-emerald-400 uppercase">
        Undercode · Interactive programming lessons
      </p>
      <h1 className="max-w-3xl text-5xl leading-[1.05] font-semibold tracking-tight text-zinc-100 sm:text-7xl">
        Learn programming by seeing how it works.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
        The learning experience is being prepared. TypeScript will be the first course.
      </p>
    </main>
  )
}

function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 sm:px-10">
      <div>
        <p className="font-mono text-sm text-emerald-400">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-100">Page not found</h1>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
