import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('login', 'LoginController').only(['index', 'store'])
}).middleware(['guest'])

Route.resource('news', 'NewsController').only(['index', 'show'])

Route.group(() => {
  Route.delete('login', 'LoginController.destroy')
  Route.get('/', 'NewsSessionsController.index').as('sessions.index')
  Route.resource('sessions', 'NewsSessionsController').except(['index'])
  Route.resource('sessions.files', 'NewsFilesController').only(['store', 'destroy'])
  Route.resource('sessions.news', 'NewsController').only(['store', 'destroy'])
}).middleware(['auth:web'])
