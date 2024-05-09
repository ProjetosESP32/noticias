import { createInertiaApp } from '@inertiajs/react'
import { renderToString } from 'react-dom/server'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
      return pages[`../pages/${name}.tsx`]
    },
    setup: ({ App, props }) => <App {...props} />,
  })
}
