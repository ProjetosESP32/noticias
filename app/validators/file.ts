import vine from '@vinejs/vine'

export const createFilesValidator = vine.compile(
  vine.object({
    files: vine.array(vine.file({ extnames: ['png', 'jpg', 'jpeg', 'mp4'] })),
  })
)
