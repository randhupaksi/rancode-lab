import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const generator = fileURLToPath(new URL('./generate-runtime-data.mjs', import.meta.url))

/** Keep generated navigation in sync when curriculum is edited during npm run dev. */
export function runtimeDataPlugin() {
  return {
    name: 'rancode-lab-runtime-data',
    apply: 'serve',
    configureServer(server) {
      let timer
      let running = false
      let queued = false
      let closed = false
      async function generate() {
        if (closed) return
        if (running) { queued = true; return }
        running = true
        try {
          await run(process.execPath, [generator], { windowsHide: true })
          // Browser catalogs are immutable deployment snapshots. Refresh after authoring changes.
          server.ws.send({ type: 'full-reload' })
        } catch (error) {
          server.config.logger.error(`Runtime data generation failed: ${error.message}`)
        } finally {
          running = false
          if (queued && !closed) { queued = false; void generate() }
        }
      }
      function onChange(file) {
        if (!file.replaceAll('\\', '/').includes('/src/content/')) return
        clearTimeout(timer)
        timer = setTimeout(() => void generate(), 150)
      }
      server.watcher.on('change', onChange)
      server.watcher.on('add', onChange)
      server.watcher.on('unlink', onChange)
      server.httpServer?.once('close', () => {
        closed = true
        clearTimeout(timer)
        server.watcher.off('change', onChange)
        server.watcher.off('add', onChange)
        server.watcher.off('unlink', onChange)
      })
    },
  }
}
