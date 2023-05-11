import { spawn } from 'node:child_process'

export const spawnAsync = async (command: string, args: string[]) => {
  const spawnedProcess = spawn(command, args)

  return new Promise<void>((resolve, reject) => {
    spawnedProcess.on('close', code => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Rejected with code ${String(code)}`))
      }
    })

    spawnedProcess.on('error', code => {
      reject(new Error(`Rejected with code ${String(code)}`))
    })
  })
}
