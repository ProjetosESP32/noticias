import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { createInertiaApp } from '@inertiajs/react'
import { hydrateRoot } from 'react-dom/client'

import '../css/reset.css'
import '../css/react-aria/index.scss'
import '../css/main.scss'

const appName = import.meta.env.VITE_APP_NAME || 'Notícias'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) =>
    resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx')),

  setup: ({ el, App, props }) => {
    hydrateRoot(el, <App {...props} />)
  },
})
