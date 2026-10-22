export const frameworkDistractors: Record<string, [string, string]> = {
  'react-components': [
    'Every nested HTML tag needs its own component',
    'Only UI that owns state can be a component',
  ],
  'react-jsx-props': ['Its own state automatically', 'A child component’s return value'],
  'react-state-events': [
    'Inside the event handler that needs state',
    'Inside a condition when the component is visible',
  ],
  'react-lists-keys': [
    'The item’s current index in a reorderable list',
    'A random value created for each render',
  ],
  'react-effects': [
    'Recalculating a value that can be derived during render',
    'Handling every button click after rendering',
  ],
  'react-composition-hooks': [
    'One shared state instance across every call',
    'The DOM nodes of the first component',
  ],
  'react-conditional-rendering': [
    'A useEffect that directly edits the DOM',
    'The position of the JSX in the file',
  ],
  'react-component-boundaries': [
    'Whenever another HTML element is nested',
    'Only after a file reaches a fixed line count',
  ],
  'react-styling-ui': [
    'The current nesting depth of the DOM',
    'A random name unrelated to the component state',
  ],
  'react-updating-objects': [
    'Mutate the existing object, then pass it to the setter',
    'Replace the object with only the changed field',
  ],
  'react-updating-arrays': [
    'push, which updates an existing array in place',
    'forEach, whose return value is the new array',
  ],
  'react-controlled-inputs': [
    'Only from defaultValue after every render',
    'From direct DOM edits that bypass state',
  ],
  'react-refs': [
    'For the count displayed on a button',
    'For replacing every state value with mutable storage',
  ],
  'react-effect-dependencies': [
    'Only values that changed during the last render',
    'Only values you want to allow to rerun the effect',
  ],
  'react-effect-cleanup': [
    'Only after the next effect has already connected',
    'Only when the entire browser tab closes',
  ],
  'react-lifting-state': [
    'In a separate state copy inside each child',
    'In the deepest child even when its sibling needs it',
  ],
  'react-context': [
    'Every temporary input value in one global provider',
    'A replacement for every parent-to-child prop',
  ],
  'react-reducer': ['The action after mutating it', 'A Promise that changes the old state later'],
  'react-derived-state': [
    'In an effect that keeps duplicate state synchronized',
    'Only once when the component initializes',
  ],
  'react-memo': [
    'For every calculation regardless of cost',
    'To make an impure render function safe',
  ],
  'react-callbacks': [
    'So the callback always keeps its first render’s data',
    'Because ordinary event handlers cannot be recreated',
  ],
  'react-transitions': [
    'The state that controls each input keystroke',
    'A synchronous validation check before submitting',
  ],
  'react-accessibility': [
    'A div with an onClick handler alone',
    'An anchor with no destination for an in-page action',
  ],
  'react-form-validation': [
    'Only in the browser’s developer console',
    'In an unrelated panel without a field association',
  ],
  'react-request-states': [
    'Only success and a permanently hidden error',
    'A single ready state for every completed request',
  ],
  'react-error-boundaries': [
    'Automatic handling of every event-handler error',
    'A silent blank screen until the app reloads',
  ],
  'react-testing-behavior': [
    'Private state variable names',
    'The exact nesting of implementation components',
  ],
  'react-feature-architecture': [
    'A fixed number of files for every feature',
    'Separating each HTML tag into a different folder',
  ],
  'react-preserving-state': [
    'Changing a prop always resets all local state',
    'Changing a CSS class resets component identity',
  ],
  'react-virtualized-lists': [
    'Every item hidden only with CSS',
    'Only one item regardless of viewport size',
  ],
  'next-file-routing': [
    'layout.tsx, which defines shared wrapping UI',
    'route.ts, which defines an HTTP endpoint',
  ],
  'next-layouts-dynamic': [
    'A literal URL segment named [slug]',
    'A query-string value available only from searchParams',
  ],
  'next-server-components': [
    'Only after hydration in the browser',
    'Inside a browser click handler',
  ],
  'next-client-components': [
    'Whenever a component renders HTML',
    'Whenever a component awaits server data',
  ],
  'next-data-fetching': [
    'Only loading and success, because empty means failure',
    'Only success, with failures sent to the console',
  ],
  'next-metadata-route-handlers': [
    'In the Client Component before sending a request',
    'In a browser effect after the response arrives',
  ],
  'next-link-navigation': [
    'A button that assigns window.location for every link',
    'An onClick handler that rewrites the page HTML',
  ],
  'next-route-groups': ['Yes, including the parentheses', 'Only when the group contains a layout'],
  'next-not-found': [
    'Show an empty success view for every missing record',
    'Keep a permanent loading indicator',
  ],
  'next-streaming-suspense': [
    'Every asynchronous operation is automatically canceled',
    'A browser state update becomes a server mutation',
  ],
  'next-caching-revalidation': [
    'The longest duration that makes the build pass',
    'A fixed interval shared by all data regardless of use',
  ],
  'next-server-actions': [
    'Only in the input’s required attribute',
    'Only inside a client submit handler',
  ],
  'next-loading-ui': [
    'A permanent placeholder that hides completed content',
    'Internal server stack traces while data loads',
  ],
  'next-error-ui': [
    'A spinner with no way to leave the failure',
    'The complete server stack trace for every visitor',
  ],
  'next-fonts-images': [
    'To make every image load before all text',
    'To remove the need for meaningful alt text',
  ],
  'next-forms-validation': [
    'Only on the client because its UI owns the form',
    'Only when the browser’s validation is disabled',
  ],
  'next-optimistic-ui': [
    'Treating the optimistic result as permanently confirmed',
    'Skipping server validation to match the optimistic view',
  ],
  'next-revalidate-path': [
    'Before every attempted mutation, including failures',
    'Only when a browser refresh button is clicked',
  ],
  'next-auth-boundaries': [
    'Only by hiding the button in the browser',
    'By trusting a role supplied in the request JSON',
  ],
  'next-route-handlers': [
    'Trust the TypeScript annotation as runtime validation',
    'Perform the write first and validate its result afterward',
  ],
  'next-code-splitting': [
    'For every small function regardless of loading cost',
    'To move a server secret safely into client code',
  ],
  'next-client-boundaries': [
    'At the root of every page regardless of interactivity',
    'Around all data fetching even when it is server-only',
  ],
  'next-seo-metadata': [
    'The same generic title for every unrelated page',
    'Keywords unrelated to the visible route content',
  ],
  'next-web-vitals': [
    'A larger number of optimization hooks',
    'Build success alone without user measurements',
  ],
  'next-environment-variables': [
    'In a NEXT_PUBLIC_ variable referenced by a Client Component',
    'In a hidden HTML element that users cannot see',
  ],
  'next-deployment-checklist': [
    'Deploy first and use visitors to discover broken routes',
    'Check only the development homepage',
  ],
  'next-observability': [
    'The complete request body and all session cookies',
    'Only a generic failed message with no route context',
  ],
  'next-security-headers': [
    'Trust it whenever the browser sends an Origin header',
    'Use a type assertion instead of checking runtime values',
  ],
  'next-full-route-review': [
    'Only success because failures are developer concerns',
    'Only loading because empty data never occurs',
  ],
  'next-bundle-analysis': [
    'Whether every TypeScript type is erased correctly',
    'Whether a database transaction has committed',
  ],
}
