const basicHandler = require('./handlers/basic')

const defaultSettings = {
  distance: 0,
  angle: 0,
  map: null,
  handler: basicHandler
}

function nfov (config) {
  if (!(this instanceof nfov)) {
    throw new Error('Constructor called as a function')
  }

  config = Object.assign({}, defaultSettings, config)
  this.setDistance(config.distance)
  this.setAngle(config.angle)
  this.setMap(config.map)
  this.setHandler(config.handler)
}

nfov.prototype.setDistance = function setDistance (distance) {
  if (typeof distance === 'number' && distance >= 0) {
    this.distance = distance
  } else {
    throw new Error('Invalid value passed for `distance`')
  }
}

nfov.prototype.getDistance = function getDistance () {
  return this.distance
}

nfov.prototype.setAngle = function setAngle (angle) {
  if (typeof angle === 'number' && angle >= 0) {
    this.angle = angle
  } else {
    throw new Error('Invalid value passed for `angle`')
  }
}

nfov.prototype.getAngle = function getAngle () {
  return this.angle
}

nfov.prototype.setMap = function setMap (map) {
  if (typeof map === 'undefined') {
    throw new Error('Invalid value passed for `map`')
  } else {
    this.map = map
  }
}

nfov.prototype.getMap = function getMap () {
  return this.map
}

nfov.prototype.setHandler = function setHandler (handler) {
  if (typeof handler === 'function') {
    this.handler = handler
  } else {
    throw new Error('Invalid value passed for `handler`')
  }
}

nfov.prototype.getHandler = function getHandler () {
  return this.handler
}

nfov.prototype.detect = function detect (agents, targets, callback) {
  const handler = this.getHandler()
  handler(this, agents, targets, callback)
}

module.exports = nfov
