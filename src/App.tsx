import { lazy } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import { LocaleProvider } from './features/locale/LocaleProvider'
import { ProgressProvider } from './features/progress/ProgressProvider'
import { useLearningCopy } from './features/journey/useLearningCopy'
import Home from './pages/HomePage'
import { routeLoaders } from './routeLoaders'
const Course = lazy(routeLoaders.course)
const CourseHub = lazy(routeLoaders.learn)
const Lesson = lazy(routeLoaders.lesson)
const Explore = lazy(routeLoaders.explore)
const Playground = lazy(routeLoaders.playground)
const Challenges = lazy(routeLoaders.challenges)
const CheatSheet = lazy(routeLoaders.reference)
const Onboarding = lazy(routeLoaders.start)
const Checkpoint = lazy(routeLoaders.checkpoint)
const Projects = lazy(routeLoaders.projects)
const Project = lazy(routeLoaders.project)

function NotFoundPage() {
  const c = useLearningCopy()
  return <div className="page-width not-found"><p className="eyebrow">404 / {c('A little off the path', 'Sedikit melenceng dari jalur')}</p><h1 className="page-heading">{c('Let’s find your way back', 'Mari kembali ke jalur belajar')}</h1><p className="page-lead">{c('This page doesn’t exist. There’s plenty more to discover in the learning path.', 'Halaman ini tidak ditemukan. Masih banyak hal menarik untuk dipelajari di jalur belajar.')}</p><Link className="button primary" to="/learn">{c('Explore the learning path', 'Jelajahi jalur belajar')}</Link></div>
}

export default function App() {
  return (
    <LocaleProvider><ProgressProvider><Routes><Route element={<SiteLayout/>}>
      <Route index element={<Home/>}/>
      <Route path="learn" element={<CourseHub/>}/>
      <Route path="start" element={<Onboarding/>}/>
      <Route path="learn/:courseId/checkpoint" element={<Checkpoint/>}/>
      <Route path="projects" element={<Projects/>}/>
      <Route path="projects/:courseId" element={<Project/>}/>
      <Route path="learn/:courseId" element={<Course/>}/>
      <Route path="learn/:courseId/:lessonId" element={<Lesson/>}/>
      <Route path="explore/:conceptId?" element={<Explore/>}/>
      <Route path="playground" element={<Playground/>}/>
      <Route path="challenges/:challengeId?" element={<Challenges/>}/>
      <Route path="cheat-sheet" element={<CheatSheet/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Route></Routes></ProgressProvider></LocaleProvider>
  )
}
