import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export default function Dialog({ open, onClose, title, children, className = '' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const previous = document.activeElement as HTMLElement | null
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
    return () => { if (dialog.open) dialog.close(); previous?.focus() }
  }, [open])
  return <dialog ref={ref} className={`dialog ${className}`} aria-label={title} onCancel={() => closeRef.current()} onClick={e => { if (e.target === e.currentTarget) closeRef.current() }}>
    <div className="dialog-body">
      <div className="dialog-heading"><h2>{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={19} /></button></div>
      {children}
    </div>
  </dialog>
}
