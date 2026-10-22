export const frameworkPractice: Record<string, string> = {
  'react-components':
    'Render two Profile components locally with different names and roles. Run the label model with the same inputs and identify the component’s responsibility.',
  'react-jsx-props':
    'Change title and minutes in the model and predict its logged summary. Locally, pass new props to LessonCard without changing its implementation.',
  'react-state-events':
    'Run increment with count 0 and 2. Locally, click Counter twice and explain the render snapshot and queued updater. Keep useState before any early return.',
  'react-lists-keys':
    'Reverse the todo array and inspect the logged labels. Locally, reorder TaskList while retaining each task.id key; explain why indices identify positions.',
  'react-effects':
    'Run the connection model. Locally, toggle browser offline mode with OnlineStatus mounted; unmount it and explain how listener cleanup mirrors setup.',
  'react-composition-hooks':
    'Run toggle twice using each returned value. Locally, render two Details components and confirm opening one leaves the other closed.',
  'react-conditional-rendering':
    'Run screen with signedIn true and false. Locally, render Results with empty and populated arrays and check both branches.',
  'react-component-boundaries':
    'Change the model’s heading. Locally, change ProfileHeader while retaining Biography and explain their separate props and responsibilities.',
  'react-styling-ui':
    'Run cardClass with two tones. Locally, toggle Status’s done prop and style task/task-complete so the text and visual state agree.',
  'react-updating-objects':
    'Print the original profile beside subscribe’s result. Locally, edit Profile’s name and verify city remains unchanged and the original object is preserved.',
  'react-updating-arrays':
    'Add a second task and finish only read; compare original and returned arrays. Locally, toggle either task while preserving unrelated items and IDs.',
  'react-controlled-inputs':
    'Inspect changeEmail’s copied form. Locally, type into Search, add a button that clears query, and confirm the displayed input follows state.',
  'react-refs':
    'Change current in the ref model. Locally, activate FocusInput with the keyboard; verify focus moves and explain why ref updates do not render UI.',
  'react-effect-dependencies':
    'Run requestKey with two terms. Locally, change PageTitle’s title prop and verify document.title changes; explain the title dependency.',
  'react-effect-cleanup':
    'Inspect stop’s logged result. Locally, repeatedly mount and unmount Timer; verify one active timer per mount and explain Strict Mode’s development cleanup check.',
  'react-lifting-state':
    'Run select with two IDs. Locally, add another Input bound to Parent’s name; editing either must update both inputs and the greeting.',
  'react-context':
    'Run label with light and dark. Locally, nest Label under an intermediate component, then change the provider value and verify the consumer updates.',
  'react-reducer':
    'Run increment and an unknown action with the same state. Locally, add a Reset button dispatching reset and keep the reducer free of side effects.',
  'react-derived-state':
    'Change cart quantities and inspect total. Locally, change TaskSummary’s tasks and verify remaining updates without duplicate state or an effect.',
  'react-memo':
    'Run expensiveTotal with a larger array. Locally, measure Results before memoizing, then change items/query to verify both dependencies control the cache.',
  'react-callbacks':
    'Compare two newly created arrow functions by identity. Locally, change unrelated Counter state and compare AddButton renders with and without useCallback.',
  'react-transitions':
    'Run beginSearch with another term. Locally, type into Search with a large list; keep input updates urgent and compare the list transition with an ordinary update.',
  'react-accessibility':
    'Try canSubmit with an empty label and disabled true. Locally, navigate EmailField with the keyboard and confirm its visible label focuses the input.',
  'react-form-validation':
    'Try @, a@, a b@example.com, and learner@example.com in the email model. Locally, submit NameForm empty and populated; inspect associated field feedback.',
  'react-request-states':
    'Extend message to distinguish error and empty results. Locally, render Results with loading, error, empty success, and populated success fixtures.',
  'react-error-boundaries':
    'Run fallback with an error and a value. Locally, wrap a child that throws during render in ErrorBoundary and add a reset/remount recovery button.',
  'react-testing-behavior':
    'Run the scenario model. Locally, perform the Counter scenario in the comparison, then check failed submission and keyboard activation through visible UI outcomes.',
  'react-feature-architecture':
    'Inspect the model’s feature files. Locally, let a parent own tasks/onToggle while TaskList renders them; identify the public data and event contract.',
  'react-preserving-state':
    'Run editorKey with two IDs. Locally, type a draft, change person.id, and compare Draft with and without the key.',
  'react-virtualized-lists':
    'Run visible with windows at both array ends. Locally, change VisibleRows’s start/count and identify the scroll geometry, overscan, and keyboard behavior a complete virtualizer still needs.',
  'next-file-routing':
    'Create both page files and open /learn and /learn/react directly. Rename a folder and predict the URL change.',
  'next-layouts-dynamic':
    'Keep the generated root layout, add the learn layout and [slug] page, then visit two slugs. Await params and verify the shared navigation.',
  'next-server-components':
    'Run the async server page. Replace its synthetic helper with a server read and explain which fields may safely reach the UI.',
  'next-client-components':
    'Split Menu and Page into separate files and toggle the menu. Remove use client temporarily, inspect the error, then restore the Menu boundary.',
  'next-data-fetching':
    'Visit the page normally, with ?demo=empty, and with ?demo=error. Add loading.tsx/error.tsx from the companion lessons and inspect each state.',
  'next-metadata-route-handlers':
    'Create the page and endpoint separately. Inspect the document title; call /api/greeting?name=Ada and the URL without name, comparing status and JSON.',
  'next-link-navigation':
    'Create both pages and navigate using Link, including keyboard activation. Open each destination directly and verify the URLs.',
  'next-route-groups':
    'Create (learning)/learn with its group layout. Verify the URL excludes parentheses and avoid defining a second page for the same /learn route.',
  'next-not-found':
    'Open /learn/react and /learn/missing. Check that notFound stops rendering and that the segment fallback offers a working recovery link.',
  'next-streaming-suspense':
    'Run the delayed Progress example and reload directly. Verify the heading appears before progress; move the Suspense boundary and compare what waits.',
  'next-caching-revalidation':
    'Use the default App Router with Cache Components disabled. Inspect revalidate: 60, compare cache: no-store, and explain the freshness tradeoff for public data.',
  'next-server-actions':
    'Create the action and form, save a goal, and inspect its cookie. Send blank/oversized input and explain the additional permission checks for a sensitive write.',
  'next-loading-ui':
    'Create /learn with loading.tsx and the delayed page. Navigate and reload directly; inspect the loading message and its replacement by ready content.',
  'next-error-ui':
    'Run the failing demo and activate Try again. Verify segment containment and explain why its error.tsx cannot catch its own segment’s layout.',
  'next-fonts-images':
    'Add your own study.jpg with the stated dimensions and matching alt text. Resize the page and verify reserved image space and the font layout.',
  'next-forms-validation':
    'Render EmailForm from the server page. Check valid, blank, @, and whitespace-containing values; bypass browser hints and verify server errors and pending feedback.',
  'next-optimistic-ui':
    'Read the cookie in the server page and pass initialSaved. Toggle the bookmark; make saveBookmark throw and verify pending feedback and rollback.',
  'next-revalidate-path':
    'Visit /learn twice, invalidate its cache with the action, then revisit. Explain why a real mutation must complete successfully before invalidation.',
  'next-auth-boundaries':
    'Call the demo endpoint and inspect 403. Set the trusted adapter to editor, send invalid JSON, and explain why request-body roles cannot grant permission.',
  'next-route-handlers':
    'POST valid JSON, invalid JSON, missing title, and a whitespace-only title to /api/lessons. Compare statuses and identify where sensitive writes need authorization.',
  'next-code-splitting':
    'Create EditorPanel and Editor and render the panel from a server page. Toggle notes while inspecting network modules and the loading fallback. Measure before claiming a speed gain.',
  'next-client-boundaries':
    'Split CompletionButton from the server page and toggle it. Inspect which file needs use client while keeping data and surrounding layout on the server.',
  'next-seo-metadata':
    'Visit both known slugs and an unknown slug. Inspect title, description, and Open Graph fields; confirm they describe the visible lesson.',
  'next-web-vitals':
    'Mount Vitals in the root layout and inspect browser reports. Record a baseline, change one measured bottleneck, and compare the same loading/interaction scenario.',
  'next-environment-variables':
    'Use synthetic environment values and restart locally. Inspect /api/config and HelpLink; explain why the public URL is visible but the token must not be returned.',
  'next-deployment-checklist':
    'Build and start the local production app with the listed commands. Check success, unknown, empty, and error routes and record configuration differences from development.',
  'next-observability':
    'Call /api/demo and match the response requestId to the server log. Confirm the log has controlled context and no bodies, cookies, or credentials.',
  'next-security-headers':
    'Add the baseline headers, restart locally, and inspect network response headers. Explain the framing tradeoff and why validation/authorization are still necessary.',
  'next-full-route-review':
    'Assemble the companion route files. Check direct/detail URLs, empty/error queries, loading, recovery links, keyboard focus, narrow screens, and metadata.',
  'next-bundle-analysis':
    'Install the local analyzer and run the platform-specific command using the Webpack build. Narrow a client boundary and record the actual client-module size difference.',
}
