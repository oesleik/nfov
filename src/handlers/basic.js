const handler = function handler (nfov, agents, targets, callback) {
  handler.each(nfov, agents, function (_agent) {
    const agent = handler.normalizeAgent(nfov, _agent)

    handler.each(nfov, targets, function (_target) {
      const target = handler.normalizeTarget(nfov, _target)

      if (handler.targetInRange(nfov, agent, target) &&
          handler.targetInFOV(nfov, agent, target) &&
          handler.targetIsVisible(nfov, agent, target)) {
        callback(_agent, _target)
      }
    })
  })
}

handler.each = function each (nfov, objs, callback) {
  if (Array.isArray(objs)) {
    objs.forEach(function (obj) {
      handler.each(nfov, obj, callback)
    })
  } else {
    callback(objs)
  }
}

handler.normalizeAgent = function normalizeAgent (nfov, obj) {
  const anchor = { x: 0.5, y: 0.5 }

  if (typeof obj.anchor === 'object') {
    anchor.x = typeof obj.anchor.x === 'number' ? obj.anchor.x : anchor.x
    anchor.y = typeof obj.anchor.y === 'number' ? obj.anchor.y : anchor.y
  }

  return {
    origin: {
      x: obj.x + obj.width * anchor.x,
      y: obj.y + obj.height * anchor.y
    },
    distance: obj.distance == null ? nfov.getDistance() : obj.distance,
    angle: obj.angle == null ? nfov.getAngle() : obj.angle,
    direction: obj.direction == null ? (obj.rotation == null ? 0 : (obj.rotation * Math.PI) / 180) : obj.direction
  }
}

handler.normalizeTarget = function normalizeTarget (nfov, obj) {
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

handler.fixPrecision = function fixPrecision (number) {
  const precision = 10000000000000
  return Math.round(number * precision) / precision
}

handler.targetInRange = function targetInRange (nfov, agent, target) {
  if (agent.distance > 0) {
    const distance = Math.sqrt(Math.pow(agent.origin.x - target.origin.x, 2) + Math.pow(agent.origin.y - target.origin.y, 2))
    return distance <= agent.distance
  } else {
    return true
  }
}

handler.targetInFOV = function targetInFOV (nfov, agent, target) {
  const halfCircle = Math.PI
  const fullCircle = halfCircle * 2

  if (agent.angle > 0 && agent.angle < fullCircle) {
    const angle2Target = Math.atan2(target.origin.y - agent.origin.y, target.origin.x - agent.origin.x)
    const diff = handler.fixPrecision((agent.direction - angle2Target + fullCircle + halfCircle) % fullCircle - halfCircle)
    const maxAngle = handler.fixPrecision(agent.angle / 2)
    return diff <= maxAngle && diff >= -maxAngle
  } else {
    return true
  }
}

handler.targetIsVisible = function targetIsVisible (nfov, agent, target) {
  return true
}

module.exports = handler
