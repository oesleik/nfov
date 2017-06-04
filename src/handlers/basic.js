const handler = function handler (nfov, agents, targets, callback) {
  handler.each(nfov, agents, function (_agent) {
    const agent = handler.agent(nfov, _agent)

    handler.each(nfov, targets, function (_target) {
      const target = handler.target(nfov, _target)

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
  return true
}

module.exports = handler
