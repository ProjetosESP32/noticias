import Server from '@ioc:Adonis/Core/Server'

Server.middleware.register([
  async () => import('@ioc:Adonis/Core/BodyParser'),
  async () => import('@ioc:Adonis/Addons/Shield'),
  async () => import('App/Middleware/SilentAuth'),
])

Server.middleware.registerNamed({
  auth: async () => import('App/Middleware/Auth'),
})
