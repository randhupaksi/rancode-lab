// Shared import functions let pointer/keyboard intent warm the same modules used by React.lazy.
export const routeLoaders = {
  course: () => import('./pages/CoursePage'), learn: () => import('./pages/LearningPathPage'),
  lesson: () => import('./pages/LessonPage'), explore: () => import('./pages/ExplorePage'), playground: () => import('./pages/PlaygroundPage'),
  challenges: () => import('./pages/ChallengesPage'), reference: () => import('./pages/CheatSheetPage'), start: () => import('./pages/OnboardingPage'),
  checkpoint: () => import('./pages/CheckpointPage'), projects: () => import('./pages/ProjectsPage'), project: () => import('./pages/ProjectPage'),
}
export function routeLoader(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  if (!parts.length) return undefined
  if (parts[0] === 'learn') return parts.length === 1 ? routeLoaders.learn : parts[2] === 'checkpoint' ? routeLoaders.checkpoint : parts.length === 2 ? routeLoaders.course : routeLoaders.lesson
  if (parts[0] === 'projects') return parts.length === 1 ? routeLoaders.projects : routeLoaders.project
  return ({ start: routeLoaders.start, explore: routeLoaders.explore, playground: routeLoaders.playground, challenges: routeLoaders.challenges, 'cheat-sheet': routeLoaders.reference } as Record<string, (() => Promise<unknown>) | undefined>)[parts[0]]
}
