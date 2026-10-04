import { useState } from 'react'
import { ArrowRight, Check, CircleAlert, PencilLine } from 'lucide-react'
import { HighlightedCode } from '../../components/ui/CodeBlock'
import ConceptCanvas from '../../components/learning/ConceptCanvas'
import LazyLab from '../../components/learning/LazyLab'
import type { ConceptVisual } from '../../content/types'
import { useLearningCopy } from '../journey/useLearningCopy'
import { useLocale } from '../locale/LocaleProvider'

const modes = ['Type inference', 'Union types', 'Generics'] as const
const examples = [
  { label: '"hello"', value: '"hello"', type: 'string' },
  { label: '42', value: '42', type: 'number' },
  { label: 'true', value: 'true', type: 'boolean' },
]

export default function HomeDemo() {
  const c = useLearningCopy()
  const { locale } = useLocale()
  const [mode, setMode] = useState<(typeof modes)[number]>('Type inference')
  const [preset, setPreset] = useState(0)
  const [editing, setEditing] = useState(false)
  const option = examples[preset]
  const unionValue = ['loading', 'success', 'finished'][preset]
  const valid = mode !== 'Union types' || preset !== 2
  const resolved = mode === 'Generics' && preset === 2 ? 'true' : option.type
  const modeLabel = (item: (typeof modes)[number]) => item === 'Type inference' ? c('Type inference', 'Inferensi type') : item === 'Union types' ? c('Union types', 'Union type') : 'Generics'
  const code = mode === 'Type inference' ? `// Give it a value. TypeScript connects the dots.\nlet message = ${option.value};\n\n// Hover over message in your editor.\nconsole.log(message);` : mode === 'Union types' ? `type Status = "loading" | "success" | "error";\n\nlet status: Status = "${unionValue}";\n\nconsole.log(status);` : `function identity<T>(value: T): T {\n  return value;\n}\n\nlet input = ${option.value};\nconst result = identity(input);`
  const visual: ConceptVisual = mode === 'Union types' ? {
    title: c('A union describes allowed values', 'Union menjelaskan nilai yang diperbolehkan'), description: c('A value must fit one of the allowed members.', 'Nilainya harus cocok dengan salah satu pilihan yang diperbolehkan.'),
    nodes: [{ id: 'input', label: `"${unionValue}"`, detail: c('This is the value you are trying to assign.', 'Ini nilai yang sedang kamu masukkan.'), tone: 'value' }, { id: 'status', label: 'Status', detail: c('A union allows loading, success, or error.', 'Union ini hanya menerima loading, success, atau error.'), tone: 'type' }, { id: 'result', label: valid ? 'assignable' : 'outside the union', detail: valid ? c('This value belongs to the allowed set.', 'Nilai ini termasuk pilihan yang diperbolehkan.') : c('The type catches this before your code runs.', 'TypeScript menemukan ketidaksesuaian ini sebelum kode dijalankan.'), tone: valid ? 'value' : 'error' }],
    edges: [{ from: 'input', to: 'status', label: c('check', 'cek') }, { from: 'status', to: 'result', label: c('result', 'hasil') }],
  } : {
    title: mode === 'Generics' ? c('The input carries its type through', 'Type input tetap terbawa sampai hasilnya') : c('A value gives the variable its type', 'Nilai membantu TypeScript menentukan type variabel'), description: c('Select a node to see its role.', 'Pilih bagian diagram untuk melihat penjelasannya.'),
    nodes: [{ id: 'value', label: option.value, detail: c('The value starts the inference. Try a different value on the left.', 'Nilai ini menjadi petunjuk awal. Coba pilih nilai lain di sebelah kiri.'), tone: 'value' }, { id: 'variable', label: mode === 'Generics' ? 'identity<T>' : 'message', detail: mode === 'Generics' ? c('T connects the input type to the return type.', 'T menghubungkan type input dengan type hasilnya.') : c('With let, TypeScript widens a primitive literal to its general type.', 'Dengan let, TypeScript memakai type umum untuk nilai dasar ini.') }, { id: 'type', label: mode === 'Generics' ? resolved : option.type, detail: mode === 'Generics' ? c('The return type preserves what TypeScript inferred for T.', 'Type hasil tetap mengikuti nilai T yang disimpulkan TypeScript.') : c(`TypeScript inferred ${option.type}; you did not need to write a type annotation.`, `TypeScript menyimpulkan type ${option.type}, jadi kamu tidak perlu menulis anotasi type.`), tone: 'type' }],
    edges: [{ from: 'value', to: 'variable', label: mode === 'Generics' ? c('input', 'masukan') : c('assign', 'isi') }, { from: 'variable', to: 'type', label: mode === 'Generics' ? c('returns', 'hasil') : c('infers', 'menyimpulkan') }],
  }
  return <section className="home-demo" aria-label={c('Interactive TypeScript example', 'Contoh TypeScript interaktif')}>
    <div className="demo-tabs" role="tablist" aria-label={c('Choose a concept', 'Pilih konsep')}>{modes.map(item => <button key={item} role="tab" aria-selected={mode === item} className={mode === item ? 'active' : ''} onClick={() => { setMode(item); setPreset(0); setEditing(false) }}>{modeLabel(item)}</button>)}<span className="demo-live"><span/> {c('Interactive example', 'Contoh interaktif')}</span></div>
    {editing ? <LazyLab initialCode={code} symbols={mode === 'Type inference' ? ['message'] : mode === 'Union types' ? ['status'] : ['input', 'result']} title={c('Make this example your own', 'Ubah contoh ini sesukamu')}/> : <div className="demo-workspace">
      <div className="demo-code-side">
        <div className="demo-file"><span className="ts-file">TS</span><span>{locale === 'id' ? 'contoh-pertamamu.ts' : 'your-first-discovery.ts'}</span><span className="muted">{c('Guided example', 'Contoh terpandu')}</span></div>
        <div className="demo-source"><div className="line-numbers" aria-hidden="true">{code.split('\n').map((_, i) => <span key={i}>{i + 1}</span>)}</div><pre><code><HighlightedCode code={code}/></code></pre></div>
        <div className="demo-controls"><span>{c('Change the value', 'Ubah nilainya')}</span><div className="value-options">{examples.map((example, index) => <button key={example.value} onClick={() => setPreset(index)} className={preset === index ? 'selected' : ''} aria-pressed={preset === index}><code>{mode === 'Union types' ? `"${['loading', 'success', 'finished'][index]}"` : example.label}</code></button>)}</div></div>
      </div>
      <div className="demo-canvas-side"><div className="demo-canvas-intro"><span className="eyebrow">{c('What is happening', 'Apa yang terjadi')}</span><h2>{mode === 'Type inference' ? c('The type was there all along', 'Type-nya sudah disimpulkan sejak awal') : mode === 'Union types' ? c('Some values fit. Others do not', 'Ada nilai yang cocok, ada yang tidak') : c('One function. A type that follows', 'Satu function, type-nya ikut terjaga')}</h2></div><ConceptCanvas visual={visual} compact/></div>
    </div>}
    <div className={`demo-bottom ${valid ? '' : 'has-error'}`}><p role="status">{valid ? <Check size={14}/> : <CircleAlert size={14}/>} {mode === 'Type inference' ? c(`Value changed. TypeScript infers ${option.type}.`, `Nilainya berubah. TypeScript menyimpulkan type ${option.type}.`) : mode === 'Union types' ? valid ? c(`"${unionValue}" is an allowed Status.`, `"${unionValue}" termasuk Status yang diperbolehkan.`) : c('“finished” is not an allowed Status.', '“finished” tidak termasuk Status yang diperbolehkan.') : c(`T resolves to ${resolved}. The result keeps that type.`, `T menjadi ${resolved}. Type hasilnya tetap sama.`)}</p><button onClick={() => setEditing(!editing)} className="text-link">{editing ? c('Return to guided example', 'Kembali ke contoh terpandu') : <><PencilLine size={13}/> {c('Edit the code yourself', 'Coba ubah kodenya sendiri')}</>}<ArrowRight size={14}/></button></div>
  </section>
}
