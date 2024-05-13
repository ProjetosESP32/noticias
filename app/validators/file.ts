import vine from '@vinejs/vine'

export const createFileValidator = vine.compile(
  vine.object({
    file: vine.file({ extnames: ['png', 'jpg', 'jpeg', 'mp4'] }),
    hasAudio: vine.boolean(),
    hasPriority: vine.boolean(),
  })
)
