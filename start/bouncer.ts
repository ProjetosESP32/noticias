import type User from 'App/Models/User'
import Bouncer from '@ioc:Adonis/Addons/Bouncer'

export const { actions } = Bouncer.define('admin', (user: User) => user.username === 'admin')

export const { policies } = Bouncer.registerPolicies({})
