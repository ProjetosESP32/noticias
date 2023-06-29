import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  if (report.healthy) response.ok(report)
  else response.badRequest(report)
})

Route.group(() => {
  Route.resource('login', 'LoginController').only(['index', 'store'])
}).middleware(['guest'])

Route.resource('news', 'NewsController').only(['index', 'show'])

Route.group(() => {
  Route.delete('login', 'LoginController.destroy')
  Route.get('/', 'NewsSessionsController.index').as('sessions.index')
  Route.resource('global', 'GlobalPostsController').only(['index', 'store', 'destroy'])
  Route.resource('sessions', 'NewsSessionsController').except(['index'])
  Route.resource('sessions.files', 'PostFilesController').only(['store', 'destroy'])
  Route.resource('sessions.news', 'NewsController').only(['store', 'destroy'])
  Route.resource('users', 'UsersController').except(['show'])
}).middleware(['auth:web'])
