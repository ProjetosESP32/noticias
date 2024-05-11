import vine from '@vinejs/vine'

export const createGroupValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(25),
    description: vine.string().maxLength(100),
    instagramToken: vine.string().optional(),
    instagramSyncDays: vine.number().min(1).max(30).optional().requiredIfExists('instagramToken'),
    newsSource: vine.string().optional(),
    newsSourceSelector: vine.string().optional().requiredIfExists('newsSource'),
  })
)

export const updateGroupValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(25).optional(),
    description: vine.string().maxLength(100).optional(),
    instagramToken: vine.string().optional(),
    instagramSyncDays: vine.number().min(1).max(30).optional().requiredIfExists('instagramToken'),
    newsSource: vine.string().optional(),
    newsSourceSelector: vine.string().optional().requiredIfExists('newsSource'),
  })
)
