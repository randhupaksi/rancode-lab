import { useEffect, useState } from 'react'
import { analyzeCode } from './client'
import type { CodeDiagnostic, InferredType } from './types'

interface TypeScriptState {
  status: 'loading' | 'ready' | 'error'
  diagnostics: CodeDiagnostic[]
  types: InferredType[]
  error?: string
}

export function useTypeScript(code: string, symbols: string[] = []): TypeScriptState {
  const [state, setState] = useState<TypeScriptState>({ status: 'loading', diagnostics: [], types: [] })
  const symbolsKey = JSON.stringify(symbols)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    setState({ status: 'loading', diagnostics: [], types: [] })
    const timer = setTimeout(() => {
      analyzeCode(code, JSON.parse(symbolsKey) as string[], controller.signal).then(
        (result) => { if (!cancelled) setState({ status: 'ready', diagnostics: result.diagnostics, types: result.types }) },
        (error: unknown) => {
          if (!cancelled) setState({ status: 'error', diagnostics: [], types: [], error: error instanceof Error ? error.message : 'Type analysis is unavailable.' })
        },
      )
    }, 350)
    return () => { cancelled = true; clearTimeout(timer); controller.abort() }
  }, [code, symbolsKey])

  return state
}
