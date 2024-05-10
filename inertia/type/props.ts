import type { User } from './user'

export type DefaultProps<P = object> = { loggedUser: User } & P
