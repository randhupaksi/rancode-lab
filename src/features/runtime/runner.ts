import { analyzeCode } from './client'
import { serializeConsoleValue } from './serializeConsole'

export interface RunResult { output: string[]; error?: string }

export async function runCode(code: string, options: { signal?: AbortSignal } = {}): Promise<RunResult> {
  const { signal } = options
  if (signal?.aborted) return { output: [], error: 'Execution cancelled.' }
  let javascript: string
  try { javascript = (await analyzeCode(code, [], signal)).javascript }
  catch (error) { return { output: [], error: error instanceof Error ? error.message : 'The compiler is unavailable.' } }

  return new Promise((resolve) => {
    const iframe = document.createElement('iframe')
    iframe.hidden = true
    iframe.title = 'Isolated code runner'
    iframe.setAttribute('sandbox', 'allow-scripts')
    iframe.setAttribute('referrerpolicy', 'no-referrer')
    const nonce = crypto.randomUUID().replaceAll('-', '')
    let finished = false
    let timeout: ReturnType<typeof setTimeout>

    function finish(result: RunResult) {
      if (finished) return
      finished = true
      clearTimeout(timeout)
      window.removeEventListener('message', receive)
      signal?.removeEventListener('abort', abort)
      iframe.remove()
      resolve(result)
    }

    function abort() { finish({ output: [], error: 'Execution cancelled.' }) }

    function receive(event: MessageEvent) {
      if (event.source !== iframe.contentWindow || event.data?.channel !== nonce) return
      if (event.data.kind === 'ready') {
        iframe.contentWindow?.postMessage({ channel: nonce, code: javascript }, '*')
      } else if (event.data.kind === 'result') {
        const output = Array.isArray(event.data.output)
          ? event.data.output.slice(0, 200).map((line: unknown) => String(line).slice(0, 2000)) : []
        finish({ output, ...(typeof event.data.error === 'string' ? { error: event.data.error.slice(0, 2000) } : {}) })
      }
    }

    // This bootstrap contains no user code. The code is messaged to the iframe,
    // then appended only to a new Blob worker; it cannot access the app's origin.
    const bootstrap = `
      const channel = ${JSON.stringify(nonce)};
      const send = (data) => parent.postMessage({ channel, ...data }, '*');
      let started = false;
      addEventListener('message', (event) => {
        if (started || event.source !== parent || event.data?.channel !== channel) return;
        started = true;
        const prelude = ${JSON.stringify(`
          const lines = [];
          const send = self.postMessage.bind(self);
          const nativeSetTimeout = self.setTimeout.bind(self);
          const nativeClearTimeout = self.clearTimeout.bind(self);
          const nativeSetInterval = self.setInterval.bind(self);
          const nativeClearInterval = self.clearInterval.bind(self);
          const timers = new Set();
          let topLevelComplete = false;
          let reported = false;
          const stringify = ${serializeConsoleValue.toString()};
          const publish = () => send({ kind: 'output', output: lines });
          const log = (...args) => { if (lines.length < 200) { lines.push(args.map(stringify).join(' ').slice(0, 2000)); publish(); } };
          Object.defineProperty(self, 'console', { value: { log, info: log, warn: log, error: log, debug: log, table: log, clear: () => { lines.length = 0; publish(); } } });
          const report = (error, failed = false) => {
            if (reported) return;
            reported = true;
            send({ kind: 'complete', output: lines, ...(failed ? { error: stringify(error) } : {}) });
          };
          const fail = (error) => report(error, true);
          const checkComplete = () => {
            if (topLevelComplete && timers.size === 0) nativeSetTimeout(() => { if (timers.size === 0) report(); }, 0);
          };
          self.setTimeout = (callback, delay, ...args) => {
            if (typeof callback !== 'function') throw new TypeError('Use a function as a timer callback.');
            const id = nativeSetTimeout(() => {
              timers.delete(id);
              try { callback(...args); } catch (error) { fail(error); }
              checkComplete();
            }, delay);
            timers.add(id);
            return id;
          };
          self.setInterval = (callback, delay, ...args) => {
            if (typeof callback !== 'function') throw new TypeError('Use a function as a timer callback.');
            const id = nativeSetInterval(() => { try { callback(...args); } catch (error) { fail(error); } }, delay);
            timers.add(id);
            return id;
          };
          self.clearTimeout = (id) => { nativeClearTimeout(id); timers.delete(id); checkComplete(); };
          self.clearInterval = (id) => { nativeClearInterval(id); timers.delete(id); checkComplete(); };
          addEventListener('unhandledrejection', (event) => { event.preventDefault(); fail(event.reason); });
          addEventListener('error', (event) => { event.preventDefault(); fail(event.error || event.message); });
          (async () => {
        `)};
        const ending = ${JSON.stringify('\n})().then(() => { topLevelComplete = true; checkComplete(); }, fail);')};
        let worker;
        let url;
        let output = [];
        let stopped = false;
        let executionTimeout;
        const stop = (result) => {
          if (stopped) return;
          stopped = true;
          clearTimeout(executionTimeout);
          if (worker) worker.terminate();
          if (url) URL.revokeObjectURL(url);
          send({ kind: 'result', output, ...result });
        };
        try {
          url = URL.createObjectURL(new Blob([prelude, event.data.code, ending], { type: 'text/javascript' }));
          worker = new Worker(url);
          worker.onmessage = ({ data }) => {
            if (Array.isArray(data.output)) output = data.output.slice(0, 200).map(line => String(line).slice(0, 2000));
            if (data.kind === 'complete') stop(typeof data.error === 'string' ? { error: data.error } : {});
          };
          worker.onerror = (event) => { event.preventDefault(); stop({ error: event.message || 'This example cannot run here. Use a standalone snippet without imports or exports.' }); };
          executionTimeout = setTimeout(() => stop({ error: 'Execution stopped after 3 seconds. Check for an infinite loop or unresolved async work.' }), 3000);
        } catch (error) { stop({ output: [], error: String(error.message || error) }); }
      });
      send({ kind: 'sready' });
    `
    iframe.srcdoc = `<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}' blob:; worker-src blob:; connect-src 'none'; img-src 'none'; style-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'"><script nonce="${nonce}">${bootstrap}</script>`
    window.addEventListener('message', receive)
    signal?.addEventListener('abort', abort, { once: true })
    timeout = setTimeout(() => finish({ output: [], error: 'The isolated runner timed out. Your browser may block sandboxed workers.' }), 5000)
    if (signal?.aborted) { abort(); return }
    document.body.append(iframe)
  })


}