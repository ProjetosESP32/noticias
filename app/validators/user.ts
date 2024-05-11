import { Database } from '@adonisjs/lucid/database'
import vine from '@vinejs/vine'

const unique = async (db: Database, v: string) => {
  const result = await db
    .from('users')
    .where('username', v)
    .count('username', 'usernameCount')
    .first()
  return BigInt(result.usernameCount) === 0n
}

export const createUserValidator = vine.compile(
  vine.object({
    username: vine.string().maxLength(55).unique(unique),
    password: vine.string().minLength(8),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    username: vine.string().maxLength(55).unique(unique).optional(),
    newPassword: vine.string().minLength(8).optional(),
    oldPassword: vine.string().minLength(8).optional().requiredIfExists('newPassword'),
  })
)
