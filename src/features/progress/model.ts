import * as z from 'zod/mini'

export const projectSchema = z.object({ code: z.string().check(z.maxLength(100000)), notes: z.string().check(z.maxLength(20000)), criteria: z.array(z.string()).check(z.maxLength(30)), completed: z.boolean(), updatedAt: z.string(), labState: z.optional(z.string().check(z.maxLength(100000))), promptDraft: z.optional(z.string().check(z.maxLength(50000))) })
export type ProjectDraft = z.infer<typeof projectSchema>

// Additive defaults preserve the existing v1 data and validation limits.
export const progressSchema = z.object({
  version: z.literal(1),
  completedLessons: z.array(z.string()).check(z.maxLength(10000)),
  completedChallenges: z.array(z.string()).check(z.maxLength(10000)),
  lastLesson: z.nullable(z.string()),
  learningProfile: z._default(z.nullable(z.object({ experience: z.string(), startCourseId: z.string() })), null),
  checkpoints: z._default(z.record(z.string(), z.object({ score: z.int().check(z.nonnegative()), total: z.int().check(z.positive()), passed: z.boolean() })), {}),
  projects: z._default(z.record(z.string(), projectSchema), {}),
})
export type Progress = z.infer<typeof progressSchema>
export const emptyProgress: Progress = { version: 1, completedLessons: [], completedChallenges: [], lastLesson: null, learningProfile: null, checkpoints: {}, projects: {} }
