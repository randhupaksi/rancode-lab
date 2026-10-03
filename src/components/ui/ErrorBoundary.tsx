import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { useLocale } from '../../features/locale/LocaleProvider'

function RecoveryState() {
  const { t } = useLocale()
  return <div className="recovery-state" role="alert"><h2>{t('error.loadTitle')}</h2><p>{t('error.loadBody')}</p><button className="button secondary" onClick={() => window.location.reload()}>{t('error.reload')}</button></div>
}

export default class ErrorBoundary extends Component<{ children: ReactNode; compact?: boolean }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('UnderCode view error', error, info.componentStack) }
  render() {
    if (this.state.failed) return <RecoveryState/>
    return this.props.children
  }
}
