function nfov () {
  if (!(this instanceof nfov)) {
    throw new Error('Constructor called as a function. Try use the syntax `new nfov()`.')
  }

  this._map = null
  this._agents = []
  this._targets = []
}

nfov.prototype.defaults = {
  agent: {
    // agent identifier
    id: null,
    // agent field of view distance
    distance: 0,
    // agent field of view angle (degrees)
    angle: 360,
    // direction the agent is facing off (degrees).
    // Zero degrees points to the right side of the x axis
    direction: 0,
    // agent initial field of view plan
    viewPlane: 3,
    // agent position
    position: { x: 0, y: 0 }
  },
  target: {
    // target identifier
    id: null,
    // target position
    position: { x: 0, y: 0 },
    // agent bounds
    bounds: { x: 0, y: 0 }
  }
}

Object.assign(nfov.prototype, require('./config/agent'))
Object.assign(nfov.prototype, require('./config/target'))
Object.assign(nfov.prototype, require('./config/map'))
Object.assign(nfov.prototype, require('./tick'))

module.exports = nfov
