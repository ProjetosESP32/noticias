import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    username: vine.string(),
    password: vine.string().minLength(8),
    rememberMe: vine.boolean(),
  })
)
