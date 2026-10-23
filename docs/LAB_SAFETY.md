# Learning labs and execution boundaries

Rancode Lab uses several teaching environments. Describe each accurately; an interactive-looking screen is not automatically a full development server.

| Environment                 | What it does                                                                                         | What it does not claim to do                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| JavaScript console practice | Runs contained JavaScript using the existing isolated runner                                         | General-purpose browser/system access                                                 |
| HTML/CSS/DOM previews       | Render in opaque-origin sandboxed frames with automatic updates and narrow/wide modes                | Network access, external resources, outbound forms, or persistent same-origin storage |
| TypeScript lessons          | Use the real type inspector                                                                          | A full server/application runtime                                                     |
| React project               | Shows a sandboxed component preview                                                                  | Access to the host app or external services                                           |
| Tailwind lab                | Compiles locally in a lazy worker using installed Tailwind and displays output in a sandboxed iframe | Plugins, external CSS imports, npm commands, or framework servers                     |
| Next.js capstone            | Demonstrates route and data-state behavior through an interactive simulator                          | A compiled local Next.js server, server APIs, or real App Router runtime              |
| Vibe Coding                 | Builds prompts and a Study Sprint browser lab                                                        | Invocation or verification of an external AI coding agent                             |

Examples that need network requests, persistent same-origin storage, external media, or Next.js server APIs belong in reading mode with local practice instructions. Do not imply that they execute inside the isolated preview.

## Safe preview changes

Keep user code inside the current worker/iframe boundaries. Preserve blocked network/external resources/outbound form behavior. Do not inject user code into the host document, add remote runtime loading, or grant the frame access to host state as a convenience.

Tailwind preview input may include `style type="text/tailwindcss"` directives for learning. In a real local project those directives belong in the input stylesheet. Compile errors and timeouts must leave the editor recoverable.

When changing a lab, verify reset behavior, error recovery, narrow/wide view, language copy, and that the learner-facing description matches real capability.
