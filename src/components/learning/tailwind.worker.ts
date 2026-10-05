import { compile } from 'tailwindcss'
import baseCss from 'tailwindcss/index.css?raw'

interface Request { candidates: string[]; customCss: string }
self.onmessage = async (event: MessageEvent<Request>) => {
  try {
    const { candidates, customCss } = event.data
    if (customCss.length > 25000 || candidates.length > 3000) throw new Error('preview-limit')
    const compiler = await compile(baseCss + '\n' + customCss, {
      loadModule: async () => { throw new Error('local-project-required') },
      loadStylesheet: async () => { throw new Error('local-project-required') },
    })
    self.postMessage({ css: compiler.build(candidates) })
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message.slice(0, 500) : 'compile-error' })
  }
}
