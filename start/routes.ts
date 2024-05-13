import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const GroupFilesController = () => import('#controllers/group_files_controller')
const GroupNewsController = () => import('#controllers/group_news_controller')
const UsersController = () => import('#controllers/users_controller')
const UploadsController = () => import('#controllers/uploads_controller')
const ClientsController = () => import('#controllers/clients_controller')
const ClientNewsController = () => import('#controllers/client_news_controller')
const ClientFilesController = () => import('#controllers/client_files_controller')
const GroupsController = () => import('#controllers/groups_controller')
const LoginController = () => import('#controllers/login_controller')

router.get('uploads/*', [UploadsController, 'get']).as('uploads')
router.resource('clients', ClientsController).only(['index', 'show'])

router
  .group(() => {
    router.delete('auth', [LoginController, 'destroy'])
    router.get('/', [GroupsController, 'index']).as('groups.index')
    router.resource('groups', GroupsController).except(['index'])
    router.resource('groups.clients', ClientsController).except(['index', 'show'])
    router.resource('groups.news', GroupNewsController).only(['store', 'destroy'])
    router.resource('groups.files', GroupFilesController).only(['store', 'destroy'])
    router.resource('groups.clients.news', ClientNewsController).only(['store', 'destroy'])
    router.resource('groups.clients.files', ClientFilesController).only(['store', 'destroy'])
    router.resource('users', UsersController).except(['show'])
  })
  .use(middleware.auth())

router
  .group(() => {
    router.resource('auth', LoginController).only(['index', 'store'])
  })
  .use(middleware.guest())
