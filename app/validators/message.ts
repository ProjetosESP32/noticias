import vine from '@vinejs/vine'

export const createNewsValidator = vine.compile(
  vine.object({
    data: vine.string(),
  })
)
