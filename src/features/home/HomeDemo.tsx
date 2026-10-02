import { useState } from 'react'
import { ArrowRight, Check, CircleAlert, PencilLine } from 'lucide-react'
import { HighlightedCode } from '../../components/ui/CodeBlock'
import ConceptCanvas from '../../components/learning/ConceptCanvas'
import LazyLab from '../../components/learning/LazyLab'
import type { ConceptVisual } from '../../content/types'

const modes = ['Type inference', 'Union types', 'Generics'] as const
const examples = [
  { label: '"hello"', value: '"hello"', type: 'string' },
  { label: '42', value: '42', type: 'number' },
  { label: 'true', value: 'true', type: 'boolean' },
]

export default function HomeDemo() {
  const [mode, setMode] = useState<(typeof modes)[number]>('Type inference')
  const [preset, setPreset] = useState(0)
  const [editing, setEditing] = useState(false)
  const option = examples[preset]
  const unionValue = ['loading', 'success', 'finished'][preset]
  const valid = mode !== 'Union types' || preset !== 2
  const resolved = mode === 'Generics' && preset === 2 ? 'true' : option.type
  const code = mode === 'Type inference' ? `// Give it a value. TypeScript connects the dots.\nlet message = ${option.value};\n\n// Hover over message in your editor.\nconsole.log(message);` : mode === 'Union types' ? `type Status = "loading" | "success" | "error";\n\nlet status: Status = "${unionValue}";\n\nconsole.log(status);` : `function identity<T>(value: T): T {\n  return value;\n}\n\nlet input = ${option.value};\nconst result = identity(input);`
  const visual: ConceptVisual = mode === 'Union types' ? {
    title: 'A union describes allowed values', description: 'A value must fit one of the allowed members.',
    nodes: [{ id: 'input', label: `"${unionValue}"`, detail: 'This is the value you are trying to assign.', tone: 'value' }, { id: 'status', label: 'Status', detail: 'A union allows loading, success, or error.', tone: 'type' }, { id: 'result', label: valid ? 'assignable' : 'outside the union', detail: valid ? 'This value belongs to the allowed set.' : 'The type catches this before your code runs.', tone: valid ? 'value' : 'error' }],
    edges: [{ from: 'input', to: 'status', label: 'check' }, { from: 'status', to: 'result', label: 'result' }],
  } : {
    title: mode === 'Generics' ? 'The input carries its type through' : 'A value gives the variable its type', description: 'Select a node to see its role.',
    nodes: [{ id: 'value', label: option.value, detail: 'The value starts the inference. Try a different value on the left.', tone: 'value' }, { id: 'variable', label: mode === 'Generics' ? 'identity<T>' : 'message', detail: mode === 'Generics' ? 'T connects the input type to the return type.' : 'With let, TypeScript widens a primitive literal to its general type.' }, { id: 'type', label: mode === 'Generics' ? resolved : option.type, detail: mode === 'Generics' ? 'The return type preserves what TypeScript inferred for T.' : `TypeScript inferred ${option.type}; you did not need to write a type annotation.`, tone: 'type' }],
    edges: [{ from: 'value', to: 'variable', label: mode === 'Generics' ? 'input' : 'assign' }, { from: 'variable', to: 'type', label: mode === 'Generics' ? 'returns' : 'infers' }],
  }
  return <section className="home-demo" aria-label="Interactive TypeScript demonstration">
    <div className="demo-tabs" role="tablist" aria-label="Choose a concept">{modes.map(item => <button key={item} role="tab" aria-selected={mode === item} className={mode === item ? 'active' : ''} onClick={() => { setMode(item); setPreset(0); setEditing(false) }}>{item}</button>)}<span className="demo-live"><span/> Interactive example</span></div>
    {editing ? <LazyLab initialCode={code} symbols={mode === 'Type inference' ? ['message'] : mode === 'Union types' ? ['status'] : ['input', 'result']} title="Make this example your own"/> : <div className="demo-workspace">
      <div className="demo-code-side">
        <div className="demo-file"><span className="ts-file">TS</span><span>your-first-discovery.ts</span><span className="muted">Guided example</span></div>
        <div className="demo-source"><div className="line-numbers" aria-hidden="true">{code.split('\n').map((_, i) => <span key={i}>{i + 1}</span>)}</div><pre><code><HighlightedCode code={code}/></code></pre></div>
        <div className="demo-controls"><span>Change the value</span><div className="value-options">{examples.map((example, index) => <button key={example.value} onClick={() => setPreset(index)} className={preset === index ? 'selected' : ''} aria-pressed={preset === index}><code>{mode === 'Union types' ? `"${['loading', 'success', 'finished'][index]}"` : example.label}</code></button>)}</div></div>
      </div>
      <div className="demo-canvas-side"><div className="demo-canvas-intro"><span className="eyebrow">Under the code</span><h2>{mode === 'Type inference' ? 'The type was there all along.' : mode === 'Union types' ? 'Some values belong. Others don’t.' : 'One function. A type that follows.'}</h2></div><ConceptCanvas visual={visual} compact/></div>
    </div>}
    <div className={`demo-bottom ${valid ? '' : 'has-error'}`}><p role="status">{valid ? <Check size={14}/> : <CircleAlert size={14}/>} {mode === 'Type inference' ? `Value changed. TypeScript infers ${option.type}.` : mode === 'Union types' ? valid ? `"${unionValue}" is an allowed Status.` : '“finished” is not an allowed Status.' : `T resolves to ${resolved}. The result keeps that type.`}</p><button onClick={() => setEditing(!editing)} className="text-link">{editing ? 'Return to guided example' : <><PencilLine size={13}/> Edit the code yourself</>}<ArrowRight size={14}/></button></div>
  </section>
}
