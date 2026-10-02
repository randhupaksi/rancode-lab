import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

export default class ErrorBoundary extends Component<{ children: ReactNode; compact?: boolean }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('UnderCode view error', error, info.componentStack) }
  render() {
    if (this.state.failed) return <div className="recovery-state" role="alert"><h2>This part could not load.</h2><p>Your learning progress stays on this device. Try loading the page again.</p><button className="button secondary" onClick={() => window.location.reload()}>Reload page</button></div>
    return this.props.children
  }
}
