import vine from '@vinejs/vine'

export const createClientValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(25),
    description: vine.string().maxLength(100),
    hasSound: vine.boolean(),
    showNews: vine.boolean(),
    showGroupNews: vine.boolean(),
  })
)

export const updateClientValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(25).optional(),
    description: vine.string().maxLength(100).optional(),
    hasSound: vine.boolean().optional(),
    showNews: vine.boolean().optional(),
    showGroupNews: vine.boolean().optional(),
  })
)
