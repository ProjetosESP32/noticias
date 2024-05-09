import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .maxLength(55)
      .exists(async (db, v) => {
        const result = await db
          .from('users')
          .where('username', v)
          .count('username', 'usernameCount')
          .first()
        return BigInt(result.usernameCount) > 0n
      }),
    password: vine.string().minLength(8),
    rememberMe: vine.boolean(),
  })
)
