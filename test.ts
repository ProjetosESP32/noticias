/* eslint-disable import/first */
/*
|--------------------------------------------------------------------------
| Tests
|--------------------------------------------------------------------------
|
| The contents in this file boots the AdonisJS application and configures
| the Japa tests runner.
|
| For the most part you will never edit this file. The configuration
| for the tests can be controlled via ".adonisrc.json" and
| "tests/bootstrap.ts" files.
|
*/

process.env.NODE_ENV = 'test'

import 'reflect-metadata'
import sourceMapSupport from 'source-map-support'
import { Ignitor } from '@adonisjs/core/build/standalone'
import { configure, processCliArgs, run, type RunnerHooksHandler } from '@japa/runner'

sourceMapSupport.install({ handleUncaughtExceptions: false })

const kernel = new Ignitor(__dirname).kernel('test')

void kernel
  .boot()
  .then(async () => import('./tests/bootstrap'))
  .then(({ runnerHooks, ...config }) => {
    const app: RunnerHooksHandler[] = [async () => kernel.start()]

    configure({
      ...kernel.application.rcFile.tests,
      ...processCliArgs(process.argv.slice(2)),
      ...config,
      ...{
        importer: async filePath => import(filePath),
        setup: app.concat(runnerHooks.setup),
        teardown: runnerHooks.teardown,
      },
      cwd: kernel.application.appRoot,
    })

    void run()
  })
