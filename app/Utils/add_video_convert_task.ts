import Application from '@ioc:Adonis/Core/Application'
import type { RequestContract } from '@ioc:Adonis/Core/Request'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import type NewsSession from 'App/Models/NewsSession'
import { videoConvertQueue } from 'App/Tasks/video_convert'

export const addVideoConvertTask = async (
  videoFiles: ReturnType<RequestContract['files']>,
  audioEnabled?: boolean,
  priority?: boolean,
  session?: NewsSession,
) => {
  const folderProcessPath = Application.tmpPath('convert')
  await Promise.all(videoFiles.map(async file => file.move(folderProcessPath, { name: `${cuid()}.mp4` })))

  videoFiles.forEach(file => {
    if (!file.filePath) return

    videoConvertQueue.enqueue({
      audioEnabled,
      priority,
      session,
      filePath: file.filePath,
      folderProcessPath,
    })
  })
}
