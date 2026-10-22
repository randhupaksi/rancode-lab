import type { Seed } from './seed'

export const reactSeeds: Seed[] = [
  {
    id: 'react-components',
    title: 'Thinking in Components',
    moduleId: 'react-foundations',
    minutes: 7,
    description:
      'A component is a focused function that turns inputs into one meaningful part of an interface. Find product boundaries before splitting markup.',
    code: '"use strict";\nfunction profileLabel(profile) {\n    return `${profile.name} · ${profile.role}`;\n}\nconst label = profileLabel({ name: "Ada", role: "Engineer" });\nconsole.log(label);',
    symbols: ['Profile', 'profileLabel', 'label'],
    topic: 'React foundations',
    question: 'What should a well-scoped component represent?',
    answer: 'One meaningful piece of the interface',
    recap: [
      'Components describe focused pieces of UI.',
      'They receive data and return a view.',
      'Choose boundaries based on meaning and reuse.',
    ],
  },
  {
    id: 'react-jsx-props',
    title: 'JSX and Props',
    moduleId: 'react-foundations',
    minutes: 7,
    description:
      'JSX describes a UI tree, while props let a parent provide the values a child needs. Curly braces bring JavaScript expressions into JSX.',
    code: '"use strict";\nfunction summary({ title, minutes }) {\n    return `${title} · ${minutes} min`;\n}\nconst text = summary({ title: "Props", minutes: 7 });',
    symbols: ['LessonCardProps', 'summary', 'text'],
    topic: 'React foundations',
    question: 'Who provides a component’s props?',
    answer: 'Its parent',
    recap: [
      'JSX describes a UI tree.',
      'Props are read-only inputs from a parent.',
      'Props make the component’s inputs explicit.',
    ],
  },
  {
    id: 'react-state-events',
    title: 'State and Events',
    moduleId: 'react-state',
    minutes: 8,
    description:
      'State is a component’s changing memory. Hooks such as useState must be called at the top level of a React component or custom Hook, before early returns; never call them in conditions, loops, ordinary functions, or event handlers. Each render sees a state snapshot: setters queue the next render instead of changing the current handler’s variable. Use a pure updater when the next value depends on the previous queued state, and create new objects instead of mutating existing state.',
    code: '"use strict";\nfunction increment(counter) {\n    return { count: counter.count + 1 };\n}\nconst next = increment({ count: 2 });\nconsole.log(next.count);',
    symbols: ['Counter', 'increment', 'next'],
    topic: 'React state',
    question: 'Where may useState be called?',
    answer: 'At the top level of a React component or custom Hook',
    recap: [
      'Keep Hook calls in a stable order on every render.',
      'Each render sees its own state snapshot.',
      'Use pure updaters and create new state values.',
    ],
  },
  {
    id: 'react-lists-keys',
    title: 'Lists and Keys',
    moduleId: 'react-state',
    minutes: 7,
    description:
      'A list maps data to repeated UI. A stable key lets React recognize the same item when the list changes.',
    code: '"use strict";\nconst todos = [{ id: "learn", title: "Learn keys" }, { id: "build", title: "Build a list" }];\nconst labels = todos.map((todo) => `${todo.id}: ${todo.title}`);\nconsole.log(labels);',
    symbols: ['Todo', 'todos', 'labels'],
    topic: 'React state',
    question: 'What makes a good key for a list item?',
    answer: 'A stable ID from the data',
    recap: [
      'Map data to repeated UI.',
      'Keys identify siblings between renders.',
      'Use stable IDs when order can change.',
    ],
  },
  {
    id: 'react-effects',
    title: 'Effects and External Systems',
    moduleId: 'react-effects',
    minutes: 8,
    description:
      'Effects synchronize a component with something outside React, such as a browser API, timer, subscription, or request. Ordinary derived values belong in render.',
    code: '"use strict";\nfunction connect() {\n    return { active: true };\n}\nconst connection = connect();\nconsole.log(connection.active);',
    symbols: ['Connection', 'connect', 'connection'],
    topic: 'React effects',
    question: 'What is an effect for?',
    answer: 'Synchronizing with an external system',
    recap: [
      'Effects connect React to external systems.',
      'Derived values usually belong in render.',
      'Clean up subscriptions and timers.',
    ],
  },
  {
    id: 'react-composition-hooks',
    title: 'Composition and Custom Hooks',
    moduleId: 'react-effects',
    minutes: 8,
    description:
      'Composition gives one component structure while another provides content. A custom Hook packages reusable stateful logic without sharing component state.',
    code: '"use strict";\nfunction toggle(value) {\n    return { on: !value.on };\n}\nconst nextToggle = toggle({ on: false });\nconsole.log(nextToggle.on);',
    symbols: ['Toggle', 'toggle', 'nextToggle'],
    topic: 'React effects',
    question: 'What does a custom Hook reuse?',
    answer: 'Stateful logic',
    recap: [
      'Composition combines focused pieces.',
      'Custom Hooks package stateful logic.',
      'Each use receives its own state.',
    ],
  },
]
