export const previewSandbox = 'allow-scripts allow-forms'

/** Scripts and form feedback stay local; resources and network submission are blocked. */
export function previewDocument(code: string, locale: 'en' | 'id', channel: string, unstyled = false): string {
  const bootstrap = `
    addEventListener('error', e => parent.postMessage({ channel: ${JSON.stringify(channel)}, error: e.message }, '*'));
    addEventListener('unhandledrejection', e => parent.postMessage({ channel: ${JSON.stringify(channel)}, error: String(e.reason) }, '*'));
    addEventListener('submit', e => {
      const method = e.submitter?.getAttribute('formmethod') ?? e.target.getAttribute('method') ?? 'get';
      if (method.trim().toLowerCase() !== 'dialog') e.preventDefault();
    });
    // srcdoc inherits the parent base URL: resolve fragment links in this document.
    addEventListener('click', e => {
      const link = e.composedPath().find(node => node instanceof HTMLAnchorElement);
      const href = link?.getAttribute('href');
      if (!href?.startsWith('#')) return;
      e.preventDefault();
      if (href === '#') { scrollTo(0, 0); return; }
      let id;
      try { id = decodeURIComponent(href.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView();
      const hadTabIndex = target.hasAttribute('tabindex');
      if (!hadTabIndex) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (!hadTabIndex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    });
  `
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'">${unstyled ? '' : '<style>body{font:16px/1.6 system-ui,sans-serif;color:#183022;background:#fff;margin:0;padding:24px;overflow-wrap:anywhere}*{box-sizing:border-box}button,input{font:inherit}button,input,a{margin:4px}button{cursor:pointer}img{max-width:100%}:focus-visible{outline:3px solid #245536;outline-offset:3px}</style>'}<script>${bootstrap}</script></head><body>${code}</body></html>`
}
