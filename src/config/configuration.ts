import { hostname } from 'os'

export default () => ({
  hostname: process.env.HOSTNAME || hostname(),
  port: Number.parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
})
