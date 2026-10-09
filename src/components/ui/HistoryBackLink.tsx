import { ArrowLeft } from 'lucide-react'
import type { MouseEvent } from 'react'
import { useNavigate, type To } from 'react-router-dom'
import TextLink from './TextLink'
import { useLocale } from '../../features/locale/LocaleProvider'

type HistoryBackLinkProps = {
  fallbackTo: To
  className?: string
  tone?: 'primary' | 'muted'
}

export default function HistoryBackLink({ fallbackTo, className, tone }: HistoryBackLinkProps) {
  const navigate = useNavigate()
  const { locale } = useLocale()
  const classes = ['history-back-link', className].filter(Boolean).join(' ')

  function goBack(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    const historyIndex = window.history.state?.idx
    if (typeof historyIndex === 'number' && historyIndex > 0) navigate(-1)
    else navigate(fallbackTo)
  }

  return <TextLink to={fallbackTo} onClick={goBack} className={classes} tone={tone}>
    <span className="history-back-link-content"><ArrowLeft size={14} aria-hidden="true"/><span>{locale === 'id' ? 'Kembali' : 'Back'}</span></span>
  </TextLink>
}
