'use strict';

var handler = function handler(nfov, agents, targets, callback) {
  handler.each(agents, function eachAgent(_agent) {
    var agent = handler.agent(nfov, _agent);

    handler.each(targets, function eachTarget(_target) {
      var target = handler.target(nfov, _target);

      if (handler.targetInRadius(nfov, agent, target) && handler.targetInAngle(nfov, agent, target) && handler.targetIsVisible(nfov, agent, target)) {
        callback(_agent, _target);
      }
    });
  });
};

handler.each = function each(objs, callback) {
  if (Array.isArray(objs)) {
    objs.forEach(function (obj) {
      handler.each(obj, callback);
    });
  } else {
    callback(objs);
  }
};

handler.fixPrecision = function fixPrecision(number) {
  var precision = 10000000000;
  return Math.round(number * precision) / precision;
};

handler.parseAngle = function parseAngle(angle, isDegrees, isClockwise) {
  angle = isDegrees === true ? angle * Math.PI / 180 : angle;
  angle = angle >= 0 ? angle : angle + Math.PI * 2;
  angle = isClockwise === true && angle > 0 ? Math.PI * 2 - angle : angle;
  return angle;
};

handler.basicObject = function basicObject(nfov, obj) {
  if (obj.x == null && obj.position == null) {
    throw new Error('Object position not found');
  }

  var position = {
    x: obj.x,
    y: obj.y
  };

  var body = {
    width: obj.width,
    height: obj.height
  };

  var anchor = {
    x: 0.5,
    y: 0.5
  };

  // phaser | pixi
  if (obj.position != null) {
    position.x = obj.position.x;
    position.y = obj.position.y;
  }

  // phaser
  if (obj.body != null && obj.body.width != null) {
    body.width = obj.body.width;
    body.height = obj.body.height;
  }

  // phaser | pixi
  if (obj.anchor != null) {
    anchor.x = 0;
    anchor.y = 0;
  }

  return {
    origin: {
      x: position.x + body.width * anchor.x,
      y: position.y + body.height * anchor.y
    }
  };
};

handler.agent = function agent(nfov, obj) {
  var agentObj = handler.basicObject(nfov, obj);

  agentObj.distance = nfov.getDistance();
  agentObj.direction = 0;
  agentObj.maxAngle = nfov.getAngle(nfov.RADIANS);

  if (obj.distance != null) {
    agentObj.distance = obj.distance;
  }

  if (obj.direction != null) {
    agentObj.direction = handler.parseAngle(obj.direction, nfov.getAngleUnit() === nfov.DEGREES, nfov.getOrientation() === nfov.CLOCKWISE);
  } else if (obj.body != null && obj.body.angle != null) {
    // phaser
    agentObj.direction = handler.parseAngle(obj.body.angle, false, true);
  } else if (obj.rotation != null) {
    // pixi
    agentObj.direction = handler.parseAngle(obj.rotation, false, true);
  }

  if (obj.maxAngle != null) {
    agentObj.maxAngle = nfov.getAngleUnit() === nfov.DEGREES ? obj.maxAngle * Math.PI / 180 : obj.maxAngle;
  }

  return agentObj;
};

handler.target = function target(nfov, obj) {
  return handler.basicObject(nfov, obj);
};

handler.angleDiff = function angleDiff(angle1, angle2) {
  var halfCircle = Math.PI;
  var fullCircle = halfCircle * 2;

  var diff = angle1 - angle2;
  diff = diff % fullCircle;

  if (diff >= halfCircle) {
    diff -= fullCircle;
  } else if (diff < -halfCircle) {
    diff += fullCircle;
  }

  return diff;
};

handler.makeRay = function makeRay(_agent, _target, tileSize) {
  var agent = {
    x: _agent.x / tileSize.width,
    y: _agent.y / tileSize.height
  };

  var target = {
    x: _target.x / tileSize.width,
    y: _target.y / tileSize.height
  };

  var direction = {
    x: target.x - agent.x,
    y: target.y - agent.y
  };

  var delta = {
    x: direction.x === 0 ? 0 : Math.abs(1 / direction.x),
    y: direction.y === 0 ? 0 : Math.abs(1 / direction.y)
  };

  var over = {
    x: agent.x - Math.floor(agent.x),
    y: agent.y - Math.floor(agent.y)
  };

  var current = {
    x: direction.x === 0 ? 2 : (direction.x > 0 ? 1 - over.x : over.x) * delta.x,
    y: direction.y === 0 ? 2 : (direction.y > 0 ? 1 - over.y : over.y) * delta.y
  };

  var step = {
    x: direction.x >= 0 ? 1 : -1,
    y: direction.y >= 0 ? 1 : -1
  };

  var point = {
    x: Math.floor(agent.x),
    y: Math.floor(agent.y)
  };

  return {
    next: function next() {
      if (current.x > 1 && current.y > 1) {
        return false;
      }

      if (current.x <= current.y) {
        current.x += delta.x;
        point.x += step.x;
      } else {
        current.y += delta.y;
        point.y += step.y;
      }

      return {
        x: point.x,
        y: point.y
      };
    }
  };
};

handler.targetInRadius = function targetInRadius(nfov, agent, target) {
  if (agent.distance > 0) {
    var dx = target.origin.x - agent.origin.x;
    var dy = agent.origin.y - target.origin.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= agent.distance;
  } else {
    return true;
  }
};

handler.targetInAngle = function targetInAngle(nfov, agent, target) {
  if (agent.maxAngle > 0 && agent.maxAngle < Math.PI * 2) {
    var vAgent = {
      x: Math.cos(agent.direction),
      y: Math.sin(agent.direction)
    };

    var vTarget = {
      x: target.origin.x - agent.origin.x,
      y: agent.origin.y - target.origin.y
    };

    var magnitude = Math.sqrt(vTarget.x * vTarget.x + vTarget.y * vTarget.y);
    vTarget.x /= magnitude;
    vTarget.y /= magnitude;

    var cdot = vAgent.x * vTarget.x + vAgent.y * vTarget.y;
    var diff = handler.fixPrecision(Math.acos(Math.max(-1, Math.min(1, cdot))));
    var maxAngle = handler.fixPrecision(agent.maxAngle / 2);
    return diff <= maxAngle;
  } else {
    return true;
  }
};

handler.targetIsVisible = function targetIsVisible(nfov, agent, target) {
  var grid = nfov.getGrid();

  if (grid != null) {
    var tileSize = nfov.getTileSize();
    var acceptableTiles = nfov.getAcceptableTiles();

    var rayCast = handler.makeRay(agent.origin, target.origin, tileSize);
    var point = rayCast.next();

    while (point) {
      if (grid[point.y] != null && grid[point.y][point.x] != null) {
        var tile = grid[point.y][point.x];

        if (acceptableTiles.indexOf(tile) >= 0) {
          point = rayCast.next();
        } else {
          return false;
        }
      } else {
        // tile not mapped
        return false;
      }
    }
  }

  return true;
};

module.exports = handler;