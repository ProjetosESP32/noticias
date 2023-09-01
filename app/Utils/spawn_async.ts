import Logger from '@ioc:Adonis/Core/Logger'
import { spawn } from 'node:child_process'

export const spawnAsync = async (command: string, args: string[]) =>
  new Promise<void>((resolve, reject) => {
    Logger.debug(`spawning: ${command} ${args.join(' ')}`)
    const spawnedProcess = spawn(command, args)

    spawnedProcess.on('close', code => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Spawn '${command} ${args.join(' ')}' rejected with code ${String(code)}`))
      }
    })

    spawnedProcess.on('error', code => {
      reject(new Error(`Spawn '${command} ${args.join(' ')}' rejected with code ${String(code)}`))
    })
  })
