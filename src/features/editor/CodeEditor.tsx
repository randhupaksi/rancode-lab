import { useEffect, useId, useRef } from 'react'
import { basicSetup } from 'codemirror'
import { Annotation, Compartment, EditorState, StateEffect, StateField } from '@codemirror/state'
import { Decoration, EditorView, keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { useLocale } from '../locale/LocaleProvider'
import './editor.css'

export interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  readOnly?: boolean
  minHeight?: number
  highlightLine?: number
}

const highlightEffect = StateEffect.define<number>()
const externalUpdate = Annotation.define<boolean>()
const lineHighlights = StateField.define({
  create: () => Decoration.none,
  update: (value, transaction) => {
    let next = value.map(transaction.changes)
    for (const effect of transaction.effects) {
      if (effect.is(highlightEffect)) {
        next = effect.value > 0 && effect.value <= transaction.state.doc.lines
          ? Decoration.set([Decoration.line({ class: 'cm-concept-highlight' }).range(transaction.state.doc.line(effect.value).from)])
          : Decoration.none
      }
    }
    return next
  },
  provide: (field) => EditorView.decorations.from(field),
})

const syntax = HighlightStyle.define([
  { tag: tags.keyword, color: 'var(--primary)' },
  { tag: [tags.typeName, tags.className], color: 'var(--type-accent)' },
  { tag: [tags.string, tags.regexp], color: 'var(--success, #48b78f)' },
  { tag: [tags.number, tags.bool, tags.null], color: 'var(--warning, #dcb478)' },
  { tag: tags.comment, color: 'var(--muted)', fontStyle: 'italic' },
  { tag: tags.function(tags.variableName), color: 'var(--type-accent)' },
  { tag: tags.invalid, color: 'var(--error)' },
])

export default function CodeEditor({ value, onChange, label, readOnly = false, minHeight = 200, highlightLine = 0 }: CodeEditorProps) {
  const { t } = useLocale()
  const editorLabel = label ?? t('code.editor')
  const container = useRef<HTMLDivElement>(null)
  const editor = useRef<EditorView | null>(null)
  const callback = useRef(onChange)
  const initialValue = useRef(value)
  const readOnlyConfig = useRef(new Compartment())
  const accessibilityConfig = useRef(new Compartment())
  const descriptionId = useId()
  callback.current = onChange

  useEffect(() => {
    if (!container.current) return
    const view = new EditorView({
      parent: container.current,
      state: EditorState.create({
        doc: initialValue.current,
        extensions: [
          basicSetup,
          javascript({ typescript: true, jsx: true }),
          syntaxHighlighting(syntax),
          keymap.of([indentWithTab]),
          lineHighlights,
          EditorView.lineWrapping,
          readOnlyConfig.current.of([EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly)]),
          accessibilityConfig.current.of(EditorView.contentAttributes.of({ 'aria-label': editorLabel, 'aria-describedby': descriptionId, 'aria-multiline': 'true', spellcheck: 'false' })),
          EditorView.updateListener.of((update) => {
            if (update.docChanged && !update.transactions.some((transaction) => transaction.annotation(externalUpdate))) callback.current(update.state.doc.toString())
          }),
        ],
      }),
    })
    editor.current = view
    return () => { editor.current = null; view.destroy() }
  }, [])

  useEffect(() => {
    const view = editor.current
    if (view && view.state.doc.toString() !== value) view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value }, annotations: externalUpdate.of(true) })
  }, [value])

  useEffect(() => {
    editor.current?.dispatch({ effects: readOnlyConfig.current.reconfigure([EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly)]) })
  }, [readOnly])

  useEffect(() => {
    editor.current?.dispatch({ effects: accessibilityConfig.current.reconfigure(EditorView.contentAttributes.of({ 'aria-label': editorLabel, 'aria-describedby': descriptionId, 'aria-multiline': 'true', spellcheck: 'false' })) })
  }, [editorLabel, descriptionId])

  useEffect(() => { editor.current?.dispatch({ effects: highlightEffect.of(highlightLine) }) }, [highlightLine, value])

  return <div className="code-editor" translate="no" style={{ '--editor-min-height': `${minHeight}px` } as React.CSSProperties}>
    <div ref={container} />
    <span className="code-editor-hint" id={descriptionId}>{readOnly ? t('code.readOnlyHint') : t('code.editHint')}</span>
  </div>
}
