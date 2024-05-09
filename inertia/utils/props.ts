import { User } from '~/type/user'

export type DefaultProps<P = object> = { loggedUser: User } & P
