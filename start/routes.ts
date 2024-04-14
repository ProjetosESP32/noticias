import router from '@adonisjs/core/services/router'

router.on('/inertia').renderInertia('home', { version: 6 })
