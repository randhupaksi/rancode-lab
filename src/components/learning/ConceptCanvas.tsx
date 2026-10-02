import { useId, useMemo, useState } from 'react'
import { ArrowRight, MousePointer2 } from 'lucide-react'
import type { ConceptVisual } from '../../content/types'
import { useLocale } from '../../features/locale/LocaleProvider'

function arrange(visual: ConceptVisual) {
  const depth = new Map(visual.nodes.map(node => [node.id, 0]))
  for (let pass = 0; pass < visual.nodes.length; pass++) {
    let changed = false
    for (const edge of visual.edges) {
      const next = Math.min((depth.get(edge.from) ?? 0) + 1, visual.nodes.length - 1)
      if (next > (depth.get(edge.to) ?? 0)) { depth.set(edge.to, next); changed = true }
    }
    if (!changed) break
  }
  const maxDepth = Math.max(1, ...depth.values())
  const groups = new Map<number, string[]>()
  visual.nodes.forEach(node => { const d = depth.get(node.id) ?? 0; groups.set(d, [...(groups.get(d) ?? []), node.id]) })
  const positions = new Map<string, { x: number; y: number }>()
  visual.nodes.forEach(node => {
    const d = depth.get(node.id) ?? 0
    const siblings = groups.get(d) ?? [node.id]
    positions.set(node.id, { x: visual.edges.length ? 100 + d / maxDepth * 520 : 360, y: 35 + (siblings.indexOf(node.id) + 1) / (siblings.length + 1) * 230 })
  })
  return positions
}

export default function ConceptCanvas({ visual, compact = false }: { visual: ConceptVisual; compact?: boolean }) {
  const { t } = useLocale()
  const [selected, setSelected] = useState(visual.nodes[0]?.id)
  const marker = useId().replaceAll(':', '')
  const positions = useMemo(() => arrange(visual), [visual])
  const node = visual.nodes.find(item => item.id === selected) ?? visual.nodes[0]
  const related = new Set([node?.id, ...visual.edges.filter(edge => edge.from === node?.id || edge.to === node?.id).flatMap(edge => [edge.from, edge.to])])
  return <section className={`concept-canvas ${compact ? 'compact' : ''}`} aria-label={visual.title}>
    <div className="canvas-heading"><span className="eyebrow">{t('canvas.title')}</span><span className="canvas-hint"><MousePointer2 size={12} /> {t('canvas.hint')}</span></div>
    <div className="concept-graph">
      <svg viewBox="0 0 720 300" aria-hidden="true" preserveAspectRatio="none">
        <defs><marker id={marker} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="currentColor" /></marker></defs>
        {visual.edges.map((edge, index) => {
          const from = positions.get(edge.from), to = positions.get(edge.to)
          if (!from || !to) return null
          const active = edge.from === node?.id || edge.to === node?.id
          const x1 = from.x + 68, x2 = to.x - 72, mid = (x1 + x2) / 2
          return <g key={index} className={active ? 'canvas-edge active' : 'canvas-edge'}><path d={`M${x1} ${from.y} C${mid} ${from.y},${mid} ${to.y},${x2} ${to.y}`} markerEnd={`url(#${marker})`} />{edge.label && <text x={mid} y={(from.y + to.y) / 2 - 9} textAnchor="middle">{edge.label}</text>}</g>
        })}
      </svg>
      {visual.nodes.map(item => { const position = positions.get(item.id)!; return <button key={item.id} className={`canvas-node ${item.tone ?? 'neutral'} ${item.id === node?.id ? 'selected' : ''} ${related.has(item.id) ? 'connected' : ''}`} style={{ left: `${position.x / 720 * 100}%`, top: `${position.y / 300 * 100}%` }} onClick={() => setSelected(item.id)} onFocus={() => setSelected(item.id)} aria-pressed={item.id === node?.id}><span className="node-indicator" /><code>{item.label}</code></button> })}
    </div>
    <div className="graph-mobile-edges" aria-label={t('canvas.relationships')}>{visual.edges.map((edge, i) => <span key={i}>{visual.nodes.find(n => n.id === edge.from)?.label}<span>{edge.label ?? t('canvas.connects')}</span><ArrowRight size={12} aria-hidden="true"/>{visual.nodes.find(n => n.id === edge.to)?.label}</span>)}</div>
    <div className="canvas-detail" aria-live="polite"><span className="detail-marker" /><p><strong>{node?.label}</strong> {node?.detail ?? visual.description}</p></div>
  </section>
}
