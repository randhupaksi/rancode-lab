import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/** Mount expensive offscreen tools shortly before they enter view; never unload edits once mounted. */
export default function DeferredContent({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const target = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!target.current || !('IntersectionObserver' in window)) { setReady(true); return }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setReady(true); observer.disconnect() }
    }, { rootMargin: '400px' })
    observer.observe(target.current)
    return () => observer.disconnect()
  }, [])
  return <div ref={target}>{ready ? children : fallback}</div>
}
