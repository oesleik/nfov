const basicHandler = require('./handlers/basic')

function nfov (config) {
  if (!(this instanceof nfov)) {
    throw new Error('Constructor called as a function')
  }

  config = Object.assign({
    distance: 0,
    angle: 0,
    angleUnit: nfov.RADIANS,
    orientation: nfov.COUNTERCLOCKWISE,
    map: null,
    handler: basicHandler
  }, config)

  this.setDistance(config.distance)
  this.setAngle(config.angle)
  this.setAngleUnit(config.angleUnit)
  this.setOrientation(config.orientation)
  this.setMap(config.map)
  this.setHandler(config.handler)
}

nfov.RADIANS = nfov.prototype.RADIANS = 1
nfov.DEGREES = nfov.prototype.DEGREES = 2

nfov.CLOCKWISE = nfov.prototype.CLOCKWISE = 1
nfov.COUNTERCLOCKWISE = nfov.prototype.COUNTERCLOCKWISE = 2

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

nfov.prototype.getAngle = function getAngle (unit) {
  if (unit === nfov.RADIANS) {
    if (this.getAngleUnit() === nfov.DEGREES) {
      return this.angle * Math.PI / 180
    }
  } else if (unit === nfov.DEGREES) {
    if (this.getAngleUnit() === nfov.RADIANS) {
      return this.angle * 180 / Math.PI
    }
  }

  return this.angle
}

nfov.prototype.setAngleUnit = function setAngleUnit (angleUnit) {
  if (angleUnit === nfov.RADIANS) {
    this.angleUnit = nfov.RADIANS
  } else if (angleUnit === nfov.DEGREES) {
    this.angleUnit = nfov.DEGREES
  } else {
    throw new Error('Invalid value passed for `angleUnit`')
  }
}

nfov.prototype.getAngleUnit = function getAngleUnit () {
  return this.angleUnit
}

nfov.prototype.setOrientation = function setOrientation (orientation) {
  if (orientation === nfov.CLOCKWISE) {
    this.orientation = nfov.CLOCKWISE
  } else if (orientation === nfov.COUNTERCLOCKWISE) {
    this.orientation = nfov.COUNTERCLOCKWISE
  } else {
    throw new Error('Invalid value passed for `orientation`')
  }
}

nfov.prototype.getOrientation = function getOrientation () {
  return this.orientation
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
