import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { progressSchema as schema, emptyProgress as empty } from './model'
import type { Progress, ProjectDraft } from './model'
export type { ProjectDraft } from './model'

const KEY = 'rancode-lab.progress.v1'
const LEGACY_KEY = 'undercode.progress.v1'
interface ProgressContext extends Progress {
  storageAvailable: boolean
  completeLesson: (id: string) => void
  completeChallenge: (id: string) => void
  visitLesson: (id: string) => void
  resetProgress: () => void
  setLearningProfile: (experience: string, startCourseId: string) => void
  saveCheckpoint: (courseId: string, score: number, total: number) => void
  saveProject: (courseId: string, draft: ProjectDraft) => void
}
const Context = createContext<ProgressContext | null>(null)

function readProgress(): { data: Progress; available: boolean } {
  try {
    const parse = (value: string | null) => {
      if (!value) return null
      try {
        const parsed = schema.safeParse(JSON.parse(value))
        return parsed.success ? parsed.data : null
      } catch { return null }
    }
    const current = parse(localStorage.getItem(KEY))
    if (current) return { data: current, available: true }
    const legacy = parse(localStorage.getItem(LEGACY_KEY))
    return { data: legacy ?? empty, available: true }
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
      try { localStorage.removeItem(LEGACY_KEY) } catch { /* Keep the old copy if cleanup is blocked. */ }
      setAvailable(true)
    } catch { setAvailable(false) }
  }, [progress])
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== KEY && event.key !== LEGACY_KEY && event.key !== null) return
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
  const setLearningProfile = useCallback((experience: string, startCourseId: string) => setProgress(p => ({ ...p, learningProfile: { experience, startCourseId } })), [])
  const saveCheckpoint = useCallback((courseId: string, score: number, total: number) => setProgress(p => {
    if (p.checkpoints[courseId]?.passed) return p
    return { ...p, checkpoints: { ...p.checkpoints, [courseId]: { score, total, passed: score === total } } }
  }), [])
  const saveProject = useCallback((courseId: string, draft: ProjectDraft) => setProgress(p => ({ ...p, projects: { ...p.projects, [courseId]: draft } })), [])
  const value = useMemo(() => ({ ...progress, storageAvailable, visitLesson, completeLesson, completeChallenge, resetProgress, setLearningProfile, saveCheckpoint, saveProject }), [progress, storageAvailable, visitLesson, completeLesson, completeChallenge, resetProgress, setLearningProfile, saveCheckpoint, saveProject])
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useProgress() {
  const context = useContext(Context)
  if (!context) throw new Error('ProgressProvider is missing')
  return context
}
