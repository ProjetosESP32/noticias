import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .maxLength(55)
      .unique(async (db, v) => {
        const result = await db
          .from('users')
          .where('username', v)
          .count('username', 'usernameCount')
          .first()
        return BigInt(result.usernameCount) === 0n
      }),
    password: vine.string().minLength(8),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .maxLength(55)
      .unique(async (db, v, f) => {
        const result = await db
          .from('users')
          .where('username', v)
          .whereNot('id', f.meta.userId)
          .count('username', 'usernameCount')
          .first()
        return BigInt(result.usernameCount) === 0n
      })
      .optional(),
    newPassword: vine.string().minLength(8).optional(),
    oldPassword: vine.string().minLength(8).optional().requiredIfExists('newPassword'),
  })
)
