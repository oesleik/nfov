const liveServer = require('live-server')

const params = {
  port: 8888,
  host: process.env.IP,
  root: '/var/www/html/nfov/examples',
  open: '/',
  logLevel: 1 // 0 = errors only, 1 = some, 2 = lots
}

liveServer.start(params)
