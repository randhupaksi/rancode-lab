import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { z } from 'zod'

const KEY = 'undercode.progress.v1'
const schema = z.object({
  version: z.literal(1),
  completedLessons: z.array(z.string()).max(10000),
  completedChallenges: z.array(z.string()).max(10000),
  lastLesson: z.string().nullable(),
})
type Progress = z.infer<typeof schema>
const empty: Progress = { version: 1, completedLessons: [], completedChallenges: [], lastLesson: null }
interface ProgressContext extends Progress {
  storageAvailable: boolean
  completeLesson: (id: string) => void
  completeChallenge: (id: string) => void
  visitLesson: (id: string) => void
  resetProgress: () => void
}
const Context = createContext<ProgressContext | null>(null)

function readProgress(): { data: Progress; available: boolean } {
  try {
    const value = localStorage.getItem(KEY)
    if (!value) return { data: empty, available: true }
    const parsed = schema.safeParse(JSON.parse(value))
    return { data: parsed.success ? parsed.data : empty, available: true }
  } catch {
    return { data: empty, available: false }
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(readProgress)
  const [progress, setProgress] = useState(initial.data)
  const [storageAvailable, setAvailable] = useState(initial.available)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress))
      setAvailable(true)
    } catch { setAvailable(false) }
  }, [progress])
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== KEY && event.key !== null) return
      const next = readProgress()
      setProgress(next.data)
      setAvailable(next.available)
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  const visitLesson = useCallback((id: string) => setProgress(p => p.lastLesson === id ? p : { ...p, lastLesson: id }), [])
  const completeLesson = useCallback((id: string) => setProgress(p => p.completedLessons.includes(id) ? p : { ...p, completedLessons: [...p.completedLessons, id] }), [])
  const completeChallenge = useCallback((id: string) => setProgress(p => p.completedChallenges.includes(id) ? p : { ...p, completedChallenges: [...p.completedChallenges, id] }), [])
  const resetProgress = useCallback(() => setProgress({ ...empty }), [])
  const value = useMemo(() => ({ ...progress, storageAvailable, visitLesson, completeLesson, completeChallenge, resetProgress }), [progress, storageAvailable, visitLesson, completeLesson, completeChallenge, resetProgress])
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useProgress() {
  const context = useContext(Context)
  if (!context) throw new Error('ProgressProvider is missing')
  return context
}
