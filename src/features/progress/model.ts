import { z } from 'zod'

export const projectSchema = z.object({ code: z.string().max(100000), notes: z.string().max(20000), criteria: z.array(z.string()).max(30), completed: z.boolean(), updatedAt: z.string() })
export type ProjectDraft = z.infer<typeof projectSchema>

// Additive defaults keep existing v1 lesson and challenge records readable.
export const progressSchema = z.object({
  version: z.literal(1),
  completedLessons: z.array(z.string()).max(10000),
  completedChallenges: z.array(z.string()).max(10000),
  lastLesson: z.string().nullable(),
  learningProfile: z.object({ experience: z.string(), startCourseId: z.string() }).nullable().default(null),
  checkpoints: z.record(z.string(), z.object({ score: z.number().int().nonnegative(), total: z.number().int().positive(), passed: z.boolean() })).default({}),
  projects: z.record(z.string(), projectSchema).default({}),
})
export type Progress = z.infer<typeof progressSchema>
export const emptyProgress: Progress = { version: 1, completedLessons: [], completedChallenges: [], lastLesson: null, learningProfile: null, checkpoints: {}, projects: {} }
