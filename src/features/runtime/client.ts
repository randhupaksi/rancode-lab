import type { AnalysisRequest, AnalysisResponse, AnalysisResult } from './types'

let worker: Worker | undefined
let requestId = 0
const pending = new Map<number, {
  resolve: (value: AnalysisResult) => void
  reject: (reason: Error) => void
  timeout: ReturnType<typeof setTimeout>
  cleanup: () => void
}>()

function failWorker(message: string) {
  worker?.terminate()
  worker = undefined
  for (const request of pending.values()) {
    clearTimeout(request.timeout)
    request.cleanup()
    request.reject(new Error(message))
  }
  pending.clear()
}

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL('./typescript.worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = ({ data }: MessageEvent<AnalysisResponse>) => {
      const request = pending.get(data.id)
      if (!request) return
      clearTimeout(request.timeout)
      request.cleanup()
      pending.delete(data.id)
      if ('error' in data) request.reject(new Error(data.error))
      else request.resolve(data.result)
    }
    worker.onerror = () => failWorker('The TypeScript engine could not start. Refresh the page and try again.')
  }
  return worker
}

/** Browser-only analysis. Loading the compiler is deferred until the first request. */
export function analyzeCode(code: string, symbols: string[] = [], signal?: AbortSignal): Promise<AnalysisResult> {
  if (signal?.aborted) return Promise.reject(new DOMException('Analysis cancelled.', 'AbortError'))
  if (code.length > 50_000) return Promise.reject(new Error('Keep this learning snippet under 50,000 characters.'))
  return new Promise((resolve, reject) => {
    const id = ++requestId
    const instance = getWorker()
    const timeout = setTimeout(() => failWorker('Type analysis took too long. Try a smaller snippet.'), 30_000)
    const abort = () => {
      clearTimeout(timeout)
      pending.delete(id)
      signal?.removeEventListener('abort', abort)
      reject(new DOMException('Analysis cancelled.', 'AbortError'))
    }
    signal?.addEventListener('abort', abort, { once: true })
    pending.set(id, { resolve, reject, timeout, cleanup: () => signal?.removeEventListener('abort', abort) })
    instance.postMessage({ id, code, symbols } satisfies AnalysisRequest)
  })
}

export type { AnalysisResult, CodeDiagnostic, InferredType } from './types'
