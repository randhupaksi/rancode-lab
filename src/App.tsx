import { lazy } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import { LocaleProvider } from './features/locale/LocaleProvider'
import { ProgressProvider } from './features/progress/ProgressProvider'
const Home = lazy(() => import('./pages/HomePage'))
const Course = lazy(() => import('./pages/CoursePage'))
const CourseHub = lazy(() => import('./pages/CourseHubPage'))
const Lesson = lazy(() => import('./pages/LessonPage'))
const Explore = lazy(() => import('./pages/ExplorePage'))
const Playground = lazy(() => import('./pages/PlaygroundPage'))
const Challenges = lazy(() => import('./pages/ChallengesPage'))
const CheatSheet = lazy(() => import('./pages/CheatSheetPage'))

function NotFoundPage() {
  return <div className="page-width not-found"><p className="eyebrow">404 / A little off the path</p><h1 className="page-heading">Let’s find your way back.</h1><p className="page-lead">This page doesn’t exist. There’s plenty more to discover in the learning path.</p><Link className="button primary" to="/learn">Explore the course</Link></div>
}

export default function App() {
  return (
    <LocaleProvider><ProgressProvider><Routes><Route element={<SiteLayout/>}>
      <Route index element={<Home/>}/>
      <Route path="learn" element={<CourseHub/>}/>
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
