import type { ConceptVisual, CanvasNode } from './types'

/** A small authored graph: labels carry meaning even without color or motion. */
export function flow(
  title: string,
  description: string,
  nodes: CanvasNode[],
  edges?: ConceptVisual['edges'],
): ConceptVisual {
  return {
    title,
    description,
    nodes,
    edges: edges ?? nodes.slice(1).map((node, index) => ({ from: nodes[index].id, to: node.id })),
  }
}

export function node(id: string, label: string, detail: string, tone: CanvasNode['tone'] = 'neutral'): CanvasNode {
  return { id, label, detail, tone }
}
