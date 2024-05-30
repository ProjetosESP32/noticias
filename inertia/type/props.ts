import type { User } from './user'

interface Default {
  loggedUser: User
}

export type DefaultProps<P = object> = Default & P
