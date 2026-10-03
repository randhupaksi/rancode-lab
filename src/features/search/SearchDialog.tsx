import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'
import MiniSearch from 'minisearch'
import { useNavigate } from 'react-router-dom'
import { lessons, concepts, challenges, getCourse, lessonPath } from '../../content'
import Dialog from '../../components/ui/Dialog'
import { useLocale } from '../locale/LocaleProvider'

type Entry = { id: string; title: string; description: string; type: string; url: string }
const entries: Entry[] = [
  ...lessons.map(item => ({ id: `lesson-${item.id}`, title: item.title, description: item.description, type: `${getCourse(item.courseId)?.title ?? 'Course'} lesson`, url: lessonPath(item) })),
  ...concepts.map(item => ({ id: `concept-${item.id}`, title: item.title, description: item.description, type: 'Concept', url: `/explore/${item.id}` })),
  ...challenges.map(item => ({ id: `challenge-${item.id}`, title: item.title, description: item.prompt, type: 'Challenge', url: `/challenges/${item.id}` })),
  ...concepts.map(item => ({ id: `reference-${item.id}`, title: item.title, description: item.description, type: 'Reference', url: `/cheat-sheet#${item.id}` })),
]
const index = new MiniSearch({ fields: ['title', 'description'], storeFields: ['title', 'description', 'type', 'url'], searchOptions: { boost: { title: 3 }, prefix: true, fuzzy: 0.2 } })
index.addAll(entries)

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const { locale, t } = useLocale()
  const list = useRef<HTMLDivElement>(null)
  const results = useMemo(() => query.trim() ? index.search(query).slice(0, 12) as unknown as Entry[] : entries.filter(item => item.id.startsWith('lesson-')).slice(0, 6), [query])
  useEffect(() => { if (open) { setQuery(''); setActive(0) } }, [open])
  useEffect(() => { list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' }) }, [active])
  const go = (entry: Entry) => { onClose(); navigate(entry.url) }
  return <Dialog open={open} onClose={onClose} title={t('search.title')} className="search-dialog">
    <div className="search-input-wrap"><Search size={19}/><input autoFocus aria-label={t('search.label')} role="combobox" aria-expanded={open} aria-controls="search-results" aria-activedescendant={results[active] ? `search-result-${active}` : undefined} placeholder={t('search.placeholder')} value={query} onChange={e => { setQuery(e.target.value); setActive(0) }} onKeyDown={e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(v => Math.max(0, Math.min(v + 1, results.length - 1))) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive(v => Math.max(v - 1, 0)) }
      if (e.key === 'Enter' && results[active]) { e.preventDefault(); go(results[active]) }
    }}/></div>
    <p className="search-label">{query ? t('search.results', { count: results.length, plural: locale === 'en' && results.length !== 1 ? 's' : '' }) : t('search.start')}</p>
    <div id="search-results" ref={list} role="listbox" aria-label={t('search.label')} className="search-results">{results.map((entry, i) => <button role="option" aria-selected={i === active} id={`search-result-${i}`} data-index={i} className={i === active ? 'search-result active' : 'search-result'} key={entry.id} onMouseEnter={() => setActive(i)} onClick={() => go(entry)}><span><strong>{entry.title}</strong><small>{entry.type}</small></span><ArrowUpRight size={17}/></button>)}{!results.length && <div className="empty-state"><h3>{t('search.empty', { query })}</h3><p>{t('search.emptyLead')}</p></div>}</div>
    <div className="search-footer"><span><kbd>↑</kbd><kbd>↓</kbd> {t('search.navigate')}</span><span><kbd>Enter</kbd> {t('search.open')}</span><span><kbd>Esc</kbd> {t('search.close')}</span></div>
  </Dialog>
}
