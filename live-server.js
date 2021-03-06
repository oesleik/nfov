const liveServer = require('live-server')
const isWindows = /^win/.test(process.platform)

const params = {
  port: 8888,
  host: process.env.IP,
  root: (isWindows ? 'c:/wamp/www/' : '/var/www/html/') + 'nfov',
  open: '/examples/',
  logLevel: 1 // 0 = errors only, 1 = some, 2 = lots
}

liveServer.start(params)
