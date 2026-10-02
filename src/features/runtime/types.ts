export interface CodeDiagnostic {
  message: string
  line: number
  column: number
  category: 'error' | 'warning'
  code: number
}

export interface InferredType {
  name: string
  type: string
  explanation: string
}

export interface AnalysisResult {
  diagnostics: CodeDiagnostic[]
  types: InferredType[]
  javascript: string
}

export interface AnalysisRequest {
  id: number
  code: string
  symbols: string[]
}

export type AnalysisResponse = { id: number; result: AnalysisResult } | { id: number; error: string }
