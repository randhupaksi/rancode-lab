import { lazy, Suspense } from 'react'
import CodeBlock from '../ui/CodeBlock'
import ErrorBoundary from '../ui/ErrorBoundary'
const LiveLab = lazy(() => import('./LiveLab'))
export default function LazyLab(props: { initialCode: string; symbols?: string[]; title?: string; runnable?: boolean }) {
  return <ErrorBoundary compact><Suspense fallback={<div><CodeBlock code={props.initialCode}/><p className="loading-note" role="status">Preparing the interactive editor…</p></div>}><LiveLab {...props}/></Suspense></ErrorBoundary>
}
