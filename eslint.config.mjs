// Flat ESLint config (ESLint 9 / Next.js 16).
//
// Next.js 16 removed the `next lint` command, so linting now runs through the
// ESLint CLI directly (`npm run lint`). `eslint-config-next` ships flat-config
// presets that bundle the Next.js, React, React Hooks, import and jsx-a11y
// rules used by the project.
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import reactHooks from 'eslint-plugin-react-hooks';

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // react-hooks v7 added `set-state-in-effect`, which flags every
      // setState made synchronously inside an effect. The places that trip it
      // here are all legitimate "sync from an external system on mount/change"
      // cases (localStorage + navigator.language, the Performance navigation
      // API, scroll listeners, IntersectionObserver, URL search params, route
      // changes) — the documented valid use of effects. Keep it visible as a
      // warning instead of failing the build.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default config;
