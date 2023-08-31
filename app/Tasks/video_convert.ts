import Logger from '@ioc:Adonis/Core/Logger'
import { JobQueue } from '../Utils/job_queue'

interface VideoJobData {
  filePath: string
  outputFilePath: string
}

const worker = async (data: VideoJobData) => {
  throw new Error('not implemented')
}

const rejectionHandler = (err: unknown) => {
  Logger.error(err, 'Error in video converter job')
}

export const videoQueue = new JobQueue(worker, rejectionHandler)
