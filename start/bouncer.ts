import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import type User from 'App/Models/User'

export const { actions } = Bouncer.before((user: User) => user.isRoot).define('root', (user: User) => user.isRoot)

export const { policies } = Bouncer.registerPolicies({})
