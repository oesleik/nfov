const handler = function handler (nfov, agents, targets, callback) {
  handler.each(agents, function (_agent) {
    const agent = handler.agent(nfov, _agent)

    handler.each(targets, function (_target) {
      const target = handler.target(nfov, _target)

      if (handler.targetInRange(nfov, agent, target) &&
          handler.targetInFOV(nfov, agent, target) &&
          handler.targetIsVisible(nfov, agent, target)) {
        callback(_agent, _target)
      }
    })
  })
}

handler.each = function each (objs, callback) {
  if (Array.isArray(objs)) {
    objs.forEach(function (obj) {
      handler.each(obj, callback)
    })
  } else {
    callback(objs)
  }
}

handler.fixPrecision = function fixPrecision (number) {
  const precision = 10000000000
  return Math.round(number * precision) / precision
}

handler.agent = function agent (nfov, obj) {
  const anchor = { x: 0.5, y: 0.5 }

  if (typeof obj.anchor === 'object') {
    anchor.x = typeof obj.anchor.x === 'number' ? obj.anchor.x : anchor.x
    anchor.y = typeof obj.anchor.y === 'number' ? obj.anchor.y : anchor.y
  }

  let distance = obj.distance == null ? nfov.getDistance() : obj.distance
  let direction = obj.direction == null ? (obj.rotation == null ? 0 : (obj.rotation * Math.PI) / 180) : obj.direction
  let maxAngle = obj.maxAngle == null ? nfov.getAngle(nfov.RADIANS) : obj.maxAngle

  if (nfov.getOrientation() === nfov.CLOCKWISE) {
    direction = Math.PI * 2 - direction
  }

  return {
    origin: {
      x: obj.x + obj.width * anchor.x,
      y: obj.y + obj.height * anchor.y
    },
    distance: distance,
    direction: direction,
    maxAngle: maxAngle
  }
}

handler.target = function target (nfov, obj) {
  const anchor = { x: 0.5, y: 0.5 }

  if (typeof obj.anchor === 'object') {
    anchor.x = typeof obj.anchor.x === 'number' ? obj.anchor.x : anchor.x
    anchor.y = typeof obj.anchor.y === 'number' ? obj.anchor.y : anchor.y
  }

  return {
    origin: {
      x: obj.x + obj.width * anchor.x,
      y: obj.y + obj.height * anchor.y
    }
  }
}

handler.angleDiff = function angleDiff (angle1, angle2) {
  const halfCircle = Math.PI
  const fullCircle = halfCircle * 2

  let diff = angle1 - angle2
  diff = diff % fullCircle

  if (diff >= halfCircle) {
    diff -= fullCircle
  } else if (diff < -halfCircle) {
    diff += fullCircle
  }

  return diff
}

handler.makeRay = function makeRay (_agent, _target, tileSize) {
  const agent = {
    x: _agent.x / tileSize.width,
    y: _agent.y / tileSize.height
  }

  const target = {
    x: _target.x / tileSize.width,
    y: _target.y / tileSize.height
  }

  const direction = {
    x: target.x - agent.x,
    y: target.y - agent.y
  }

  const delta = {
    x: direction.x === 0 ? 0 : Math.abs(1 / direction.x),
    y: direction.y === 0 ? 0 : Math.abs(1 / direction.y)
  }

  const over = {
    x: agent.x - Math.floor(agent.x),
    y: agent.y - Math.floor(agent.y)
  }

  const current = {
    x: direction.x === 0 ? 2 : (direction.x > 0 ? 1 - over.x : over.x) * delta.x,
    y: direction.y === 0 ? 2 : (direction.y > 0 ? 1 - over.y : over.y) * delta.y
  }

  const step = {
    x: direction.x >= 0 ? 1 : -1,
    y: direction.y >= 0 ? 1 : -1
  }

  const point = {
    x: Math.floor(agent.x),
    y: Math.floor(agent.y)
  }

  let value = direction.x === 0 && direction.y === 0 ? 2 : 0

  return {
    next: function next () {
      if (value > 1) {
        return false
      }

      if (current.x <= current.y) {
        current.x += delta.x
        value = current.x
        point.x += step.x
      } else {
        current.y += delta.y
        value = current.y
        point.y += step.y
      }

      return {
        x: point.x,
        y: point.y
      }
    }
  }
}

handler.targetInRange = function targetInRange (nfov, agent, target) {
  if (agent.distance > 0) {
    const dx = target.origin.x - agent.origin.x
    const dy = agent.origin.y - target.origin.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance <= agent.distance
  } else {
    return true
  }
}

handler.targetInFOV = function targetInFOV (nfov, agent, target) {
  const halfCircle = Math.PI
  const fullCircle = halfCircle * 2

  if (agent.maxAngle > 0 && agent.maxAngle < fullCircle) {
    const angle2Target = Math.atan2(agent.origin.y - target.origin.y, target.origin.x - agent.origin.x)
    const diff = handler.fixPrecision(handler.angleDiff(agent.direction, angle2Target))
    const maxAngle = handler.fixPrecision(agent.maxAngle / 2)
    return diff <= maxAngle && diff >= -maxAngle
  } else {
    return true
  }
}

handler.targetIsVisible = function targetIsVisible (nfov, agent, target) {
  const grid = nfov.getGrid()

  if (grid != null) {
    const tileSize = nfov.getTileSize()
    const acceptableTiles = nfov.getAcceptableTiles()

    const rayCast = handler.makeRay(agent.origin, target.origin, tileSize)
    let point = rayCast.next()

    while (point) {
      if (grid[point.y] != null && grid[point.y][point.x] != null) {
        const tile = grid[point.y][point.x]

        if (acceptableTiles.indexOf(tile) >= 0) {
          point = rayCast.next()
        } else {
          return false
        }
      } else {
        // tile not mapped
        return false
      }
    }
  }

  return true
}

module.exports = handler
