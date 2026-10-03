import { lazy, Suspense } from 'react'
import CodeBlock from '../ui/CodeBlock'
import ErrorBoundary from '../ui/ErrorBoundary'
import { useLocale } from '../../features/locale/LocaleProvider'
const LiveLab = lazy(() => import('./LiveLab'))
export default function LazyLab(props: { initialCode: string; value?: string; onChange?: (code: string) => void; symbols?: string[]; title?: string; runnable?: boolean }) {
  const { t } = useLocale()
  return <ErrorBoundary compact><Suspense fallback={<div><CodeBlock code={props.initialCode}/><p className="loading-note" role="status">{t('lab.preparing')}</p></div>}><LiveLab {...props}/></Suspense></ErrorBoundary>
}
