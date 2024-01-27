import Application from '@ioc:Adonis/Core/Application'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import type { RequestContract } from '@ioc:Adonis/Core/Request'
import { videoConvertQueue } from 'App/Tasks/video_convert'

export const addVideoConvertTask = async (
  groupId: number,
  sessionId: number | null,
  videoFiles: ReturnType<RequestContract['files']>,
  audioEnabled?: boolean,
  priority?: boolean,
) => {
  const folderProcessPath = Application.tmpPath('convert')
  await Promise.all(videoFiles.map(async file => file.move(folderProcessPath, { name: cuid() })))

  await videoConvertQueue.enqueueAll(
    videoFiles
      .filter(file => !!file.filePath)
      .map(file => ({ groupId, audioEnabled, priority, sessionId, filePath: file.filePath!, folderProcessPath })),
  )
}
