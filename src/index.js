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
    grid: null,
    tileSize: {
      width: 1,
      height: 1
    },
    acceptableTiles: [],
    handler: basicHandler
  }, config)

  this.setDistance(config.distance)
  this.setAngle(config.angle)
  this.setAngleUnit(config.angleUnit)
  this.setOrientation(config.orientation)
  this.setGrid(config.grid)
  this.setTileSize(config.tileSize)
  this.setAcceptableTiles(config.acceptableTiles)
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

nfov.prototype.setGrid = function setGrid (grid) {
  if (grid == null || Array.isArray(grid)) {
    this.grid = grid
  } else {
    throw new Error('Invalid value passed for `grid`')
  }
}

nfov.prototype.getGrid = function getGrid () {
  return this.grid
}

nfov.prototype.setTileSize = function setTileSize (widthOrObj, height) {
  if (widthOrObj > 0) {
    this.tileSize = {
      width: widthOrObj,
      height: height > 0 ? height : widthOrObj
    }
  } else if (widthOrObj != null && widthOrObj.width > 0 && widthOrObj.height > 0) {
    this.tileSize = {
      width: widthOrObj.width,
      height: widthOrObj.height
    }
  } else {
    throw new Error('Invalid value passed for `tileSize`')
  }
}

nfov.prototype.getTileSize = function getTileSize () {
  return this.tileSize
}

nfov.prototype.setAcceptableTiles = function setAcceptableTiles (tiles) {
  if (Array.isArray(tiles)) {
    this.acceptableTiles = tiles.slice(0)
  } else if (tiles != null) {
    this.acceptableTiles = [tiles]
  } else {
    throw new Error('Invalid value passed for `tiles`')
  }
}

nfov.prototype.getAcceptableTiles = function getAcceptableTiles () {
  return this.acceptableTiles
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
