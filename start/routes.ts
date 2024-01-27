import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  if (report.healthy) response.ok(report)
  else response.badRequest(report)
})

Route.group(() => {
  Route.resource('auth/login', 'UserSessionsController').only(['index', 'store'])
}).middleware(['guest'])

Route.get('all-sessions', 'AllNewsSessionsController.index')

Route.group(() => {
  Route.get('/', ({ response }) => {
    response.redirect('/groups')
  })

  Route.delete('auth/logout', 'UserSessionsController.destroy')
  Route.resource('groups', 'NewsGroupsController')
  Route.resource('groups.sessions', 'NewsSessionsController').except(['index'])
  Route.resource('groups.global-posts', 'GlobalPostsController').only(['index', 'store', 'destroy'])
  Route.resource('groups.sessions.news', 'NewsController').only(['store', 'destroy'])
  Route.resource('groups.sessions.posts', 'PostFilesController').only(['store', 'destroy'])
  Route.resource('users', 'UsersController').except(['show'])
}).middleware(['auth:web'])
