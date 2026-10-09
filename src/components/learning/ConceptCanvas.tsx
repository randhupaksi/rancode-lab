import { useEffect, useId, useMemo, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, MousePointer2, RotateCcw, SlidersHorizontal } from 'lucide-react'
import type { CanvasEdge, ConceptVisual } from '../../content/types'
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

function getInitialValues(visual: ConceptVisual) {
  return Object.fromEntries(visual.simulation?.inputs.map(input => [input.nodeId, input.initial]) ?? [])
}

export default function ConceptCanvas({ visual, compact = false }: { visual: ConceptVisual; compact?: boolean }) {
  const { t } = useLocale()
  const visualKey = `${visual.title}-${visual.nodes.map(node => node.id).join('-')}`
  const [selected, setSelected] = useState(visual.nodes[0]?.id)
  const [selectedEdge, setSelectedEdge] = useState<number | null>(null)
  const [guideStep, setGuideStep] = useState(0)
  const [values, setValues] = useState(() => getInitialValues(visual))
  const marker = useId().replaceAll(':', '')
  const positions = useMemo(() => arrange(visual), [visual])
  const mobileLayers = useMemo(() => {
    const groups = new Map<number, typeof visual.nodes>()
    visual.nodes.forEach(item => {
      const layer = positions.get(item.id)?.x ?? 360
      groups.set(layer, [...(groups.get(layer) ?? []), item])
    })
    return [...groups.entries()].sort(([left], [right]) => left - right).map(([layer, nodes]) => ({ layer, nodes }))
  }, [positions, visual.nodes])
  const mobileLayerByNode = new Map(mobileLayers.flatMap((layer, index) => layer.nodes.map(item => [item.id, index] as const)))
  const mobileEdgesByLayer = new Map<number, { edge: CanvasEdge; index: number }[]>()
  visual.edges.forEach((edge, index) => {
    const fromLayer = mobileLayerByNode.get(edge.from)
    const toLayer = mobileLayerByNode.get(edge.to)
    if (fromLayer === undefined || toLayer === undefined || toLayer <= fromLayer) return
    mobileEdgesByLayer.set(fromLayer, [...(mobileEdgesByLayer.get(fromLayer) ?? []), { edge, index }])
  })
  const node = visual.nodes.find(item => item.id === selected) ?? visual.nodes[0]
  const relation = selectedEdge === null ? undefined : visual.edges[selectedEdge]
  const related = new Set([node?.id, ...visual.edges.filter(edge => edge.from === node?.id || edge.to === node?.id).flatMap(edge => [edge.from, edge.to])])
  const simulation = visual.simulation
  const total = simulation?.kind === 'multiply' ? simulation.inputs.reduce((result, input) => result * (values[input.nodeId] ?? input.initial), 1) : undefined

  useEffect(() => {
    setSelected(visual.nodes[0]?.id)
    setSelectedEdge(null)
    setGuideStep(0)
    setValues(getInitialValues(visual))
  }, [visualKey])

  const labelFor = (id: string) => visual.nodes.find(item => item.id === id)?.label ?? id
  const describeRelation = (edge: CanvasEdge) => `${labelFor(edge.from)} ${edge.label ?? t('canvas.connects')} ${labelFor(edge.to)}`
  const selectNode = (nodeId: string) => {
    setSelected(nodeId)
    setSelectedEdge(null)
    setGuideStep(Math.max(0, visual.nodes.findIndex(item => item.id === nodeId)))
  }
  const selectEdge = (index: number) => {
    const edge = visual.edges[index]
    setSelected(edge.to)
    setSelectedEdge(index)
    setGuideStep(Math.max(0, visual.nodes.findIndex(item => item.id === edge.to)))
  }
  const changeStep = (nextStep: number) => {
    const bounded = Math.max(0, Math.min(nextStep, visual.nodes.length - 1))
    const nextNode = visual.nodes[bounded]
    const previousNode = visual.nodes[bounded - 1]
    setGuideStep(bounded)
    setSelected(nextNode.id)
    const edgeIndex = previousNode ? visual.edges.findIndex(edge => edge.from === previousNode.id && edge.to === nextNode.id) : -1
    setSelectedEdge(edgeIndex >= 0 ? edgeIndex : null)
  }
  const resetCanvas = () => {
    setSelected(visual.nodes[0]?.id)
    setSelectedEdge(null)
    setGuideStep(0)
    setValues(getInitialValues(visual))
  }
  const updateValue = (nodeId: string, value: number) => {
    setValues(current => ({ ...current, [nodeId]: value }))
    if (simulation) {
      setSelected(simulation.outputNodeId)
      setSelectedEdge(visual.edges.findIndex(edge => edge.to === simulation.outputNodeId))
      setGuideStep(Math.max(0, visual.nodes.findIndex(item => item.id === simulation.outputNodeId)))
    }
  }
  const detailTitle = relation ? describeRelation(relation) : node?.label
  const detailText = relation?.detail ?? node?.detail ?? visual.description

  return <section className={`concept-canvas ${compact ? 'compact' : ''}`} aria-label={visual.title}>
    <div className="canvas-heading"><span className="eyebrow">{t('canvas.title')}</span><span className="canvas-hint"><MousePointer2 size={12} /> {t('canvas.hint')}</span></div>
    <div className="concept-graph">
      <svg viewBox="0 0 720 300" role="group" aria-label={t('canvas.relationships')} preserveAspectRatio="none">
        <defs><marker id={marker} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="currentColor" /></marker></defs>
        {visual.edges.map((edge, index) => {
          const from = positions.get(edge.from), to = positions.get(edge.to)
          if (!from || !to) return null
          const outgoing = visual.edges.filter(item => item.from === edge.from)
          const incoming = visual.edges.filter(item => item.to === edge.to)
          const sourceOffset = (outgoing.indexOf(edge) - (outgoing.length - 1) / 2) * 14
          const targetOffset = (incoming.indexOf(edge) - (incoming.length - 1) / 2) * 16
          const x1 = from.x + 68, x2 = to.x - 72, mid = (x1 + x2) / 2
          const y1 = from.y + sourceOffset, y2 = to.y + targetOffset
          const path = `M${x1} ${y1} C${mid} ${y1},${mid} ${y2},${x2} ${y2}`
          const labelSide = y2 >= y1 ? -1 : 1
          const labelY = (y1 + y2) / 2 + labelSide * 22
          const labelWidth = edge.label ? Math.max(38, edge.label.length * 6 + 14) : 0
          const active = index === selectedEdge || (!relation && (edge.from === node?.id || edge.to === node?.id))
          return <g key={index} className={active ? 'canvas-edge active' : 'canvas-edge'} role="button" tabIndex={0} aria-label={describeRelation(edge)} aria-pressed={index === selectedEdge} onClick={() => selectEdge(index)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectEdge(index) } }}>
            <path className="canvas-edge-hitbox" d={path} />
            <path d={path} markerEnd={`url(#${marker})`} />
            {edge.label && <g className="canvas-edge-label" transform={`translate(${mid},${labelY})`} aria-hidden="true"><rect x={-labelWidth / 2} y={-8} width={labelWidth} height={16} rx={4}/><text textAnchor="middle" dominantBaseline="central">{edge.label}</text></g>}
          </g>
        })}
      </svg>
      {visual.nodes.map(item => {
        const position = positions.get(item.id)!
        const value = simulation?.inputs.some(input => input.nodeId === item.id) ? values[item.id] : simulation?.outputNodeId === item.id ? total : undefined
        return <button key={item.id} className={`canvas-node ${item.tone ?? 'neutral'} ${item.id === node?.id ? 'selected' : ''} ${related.has(item.id) ? 'connected' : ''}`} style={{ left: `${position.x / 720 * 100}%`, top: `${position.y / 300 * 100}%` }} onClick={() => selectNode(item.id)} onFocus={() => selectNode(item.id)} aria-pressed={item.id === node?.id}>
          <span className="node-indicator" />
          {item.symbol && <span className="node-symbol" aria-hidden="true">{item.symbol}</span>}
          <code>{item.label}</code>
          {value !== undefined && <output className="node-value">{value}</output>}
        </button>
      })}
    </div>
    <div className="concept-graph-mobile" role="group" aria-label={t('canvas.relationships')}>
      {mobileLayers.map((layer, layerIndex) => <div className="mobile-graph-segment" key={layer.layer}>
        <div className={`mobile-graph-stage ${layer.nodes.length === 1 ? 'single' : 'multiple'}`}>
          {layer.nodes.map(item => {
            const value = simulation?.inputs.some(input => input.nodeId === item.id) ? values[item.id] : simulation?.outputNodeId === item.id ? total : undefined
            return <button type="button" key={item.id} className={`canvas-node ${item.tone ?? 'neutral'} ${item.id === node?.id ? 'selected' : ''} ${related.has(item.id) ? 'connected' : ''}`} onClick={() => selectNode(item.id)} onFocus={() => selectNode(item.id)} aria-pressed={item.id === node?.id}>
              <span className="node-indicator" />
              {item.symbol && <span className="node-symbol" aria-hidden="true">{item.symbol}</span>}
              <code>{item.label}</code>
              {value !== undefined && <output className="node-value">{value}</output>}
            </button>
          })}
        </div>
        {!!mobileEdgesByLayer.get(layerIndex)?.length && <div className={`mobile-graph-transitions ${layer.nodes.length === 1 ? 'single' : 'multiple'}`}>
          {mobileEdgesByLayer.get(layerIndex)?.map(({ edge, index }) => <button type="button" key={`${edge.from}-${edge.to}-${index}`} className={selectedEdge === index ? 'active' : ''} style={{ gridColumn: layer.nodes.length === 2 ? layer.nodes.findIndex(item => item.id === edge.from) + 1 : undefined }} onClick={() => selectEdge(index)} aria-label={describeRelation(edge)}>
            <ArrowDown size={14} aria-hidden="true" />
            <span>{edge.label ?? t('canvas.connects')}</span>
          </button>)}
        </div>}
      </div>)}
    </div>
    <div className="canvas-guide" aria-label={t('canvas.guide')}>
      <span>{t('canvas.step', { current: guideStep + 1, total: visual.nodes.length })}</span>
      <div><button type="button" className="icon-button" onClick={() => changeStep(guideStep - 1)} disabled={guideStep === 0} aria-label={t('canvas.previous')}><ArrowLeft size={15}/></button><button type="button" className="icon-button" onClick={() => changeStep(guideStep + 1)} disabled={guideStep === visual.nodes.length - 1} aria-label={t('canvas.next')}><ArrowRight size={15}/></button><button type="button" className="icon-button" onClick={resetCanvas} aria-label={t('canvas.reset')}><RotateCcw size={14}/></button></div>
    </div>
    <div className="canvas-detail" aria-live="polite"><span className="detail-marker" /><p><strong>{detailTitle}</strong> {detailText}</p></div>
    {simulation && <fieldset className="canvas-simulator"><legend><SlidersHorizontal size={13} aria-hidden="true"/> {t('canvas.tryCalculation')}</legend><output className="canvas-formula" aria-live="polite">{simulation.inputs.map(input => values[input.nodeId]).join(' × ')} = {total}</output><div className="canvas-simulator-controls">{simulation.inputs.map(input => <label key={input.nodeId}><span>{labelFor(input.nodeId)} <output>{values[input.nodeId]}</output></span><input type="range" min={input.min} max={input.max} step={input.step} value={values[input.nodeId]} onChange={event => updateValue(input.nodeId, Number(event.target.value))} aria-label={labelFor(input.nodeId)} /></label>)}</div></fieldset>}
  </section>
}
