import Server from '@ioc:Adonis/Core/Server'

Server.middleware.register([
  async () => import('@ioc:Adonis/Core/BodyParser'),
  async () => import('@ioc:Adonis/Addons/Shield'),
])

Server.middleware.registerNamed({})
