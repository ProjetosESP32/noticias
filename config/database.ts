import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        ssl: {
          rejectUnauthorized: false,
        },
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      pool: {
        afterCreate(conn, done) {
          conn
            .query(`SET search_path TO ${env.get('DB_SCHEMA', 'public')};`)
            .then(() => done())
            .catch(done)
        },
      },
    },
  },
})

export default dbConfig
