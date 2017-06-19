(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["nfov"] = factory();
	else
		root["nfov"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var handler = function handler(nfov, agents, targets, callback) {
  handler.each(agents, function eachAgent(_agent) {
    var agent = handler.agent(nfov, _agent);

    handler.each(targets, function eachTarget(_target) {
      var target = handler.target(nfov, _target);

      if (handler.targetInRange(nfov, agent, target) && handler.targetInFOV(nfov, agent, target) && handler.targetIsVisible(nfov, agent, target)) {
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
  } else if (obj.body != null && obj.body.rotation != null) {
    // phaser
    agentObj.direction = handler.parseAngle(obj.body.rotation, true, true);
  } else if (obj.body != null && obj.body.angle != null) {
    // phaser
    agentObj.direction = handler.parseAngle(obj.body.angle, false, true);
  } else if (obj.rotation != null) {
    agentObj.direction = handler.parseAngle(obj.rotation, nfov.getAngleUnit() === nfov.DEGREES, nfov.getOrientation() === nfov.CLOCKWISE);
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

handler.targetInRange = function targetInRange(nfov, agent, target) {
  if (agent.distance > 0) {
    var dx = target.origin.x - agent.origin.x;
    var dy = agent.origin.y - target.origin.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= agent.distance;
  } else {
    return true;
  }
};

handler.targetInFOV = function targetInFOV(nfov, agent, target) {
  var halfCircle = Math.PI;
  var fullCircle = halfCircle * 2;

  if (agent.maxAngle > 0 && agent.maxAngle < fullCircle) {
    var angle2Target = Math.atan2(agent.origin.y - target.origin.y, target.origin.x - agent.origin.x);
    var diff = handler.fixPrecision(handler.angleDiff(agent.direction, angle2Target));
    var maxAngle = handler.fixPrecision(agent.maxAngle / 2);
    return diff <= maxAngle && diff >= -maxAngle;
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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var basicHandler = __webpack_require__(0);

function nfov(config) {
  if (!(this instanceof nfov)) {
    throw new Error('Constructor called as a function');
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
  }, config);

  this.setDistance(config.distance);
  this.setAngle(config.angle);
  this.setAngleUnit(config.angleUnit);
  this.setOrientation(config.orientation);
  this.setGrid(config.grid);
  this.setTileSize(config.tileSize);
  this.setAcceptableTiles(config.acceptableTiles);
  this.setHandler(config.handler);
}

nfov.RADIANS = nfov.prototype.RADIANS = 1;
nfov.DEGREES = nfov.prototype.DEGREES = 2;

nfov.CLOCKWISE = nfov.prototype.CLOCKWISE = 1;
nfov.COUNTERCLOCKWISE = nfov.prototype.COUNTERCLOCKWISE = 2;

nfov.prototype.setDistance = function setDistance(distance) {
  if (typeof distance === 'number' && distance >= 0) {
    this.distance = distance;
  } else {
    throw new Error('Invalid value passed for `distance`');
  }
};

nfov.prototype.getDistance = function getDistance() {
  return this.distance;
};

nfov.prototype.setAngle = function setAngle(angle) {
  if (typeof angle === 'number' && angle >= 0) {
    this.angle = angle;
  } else {
    throw new Error('Invalid value passed for `angle`');
  }
};

nfov.prototype.getAngle = function getAngle(unit) {
  if (unit === nfov.RADIANS) {
    if (this.getAngleUnit() === nfov.DEGREES) {
      return this.angle * Math.PI / 180;
    }
  } else if (unit === nfov.DEGREES) {
    if (this.getAngleUnit() === nfov.RADIANS) {
      return this.angle * 180 / Math.PI;
    }
  }

  return this.angle;
};

nfov.prototype.setAngleUnit = function setAngleUnit(angleUnit) {
  if (angleUnit === nfov.RADIANS) {
    this.angleUnit = nfov.RADIANS;
  } else if (angleUnit === nfov.DEGREES) {
    this.angleUnit = nfov.DEGREES;
  } else {
    throw new Error('Invalid value passed for `angleUnit`');
  }
};

nfov.prototype.getAngleUnit = function getAngleUnit() {
  return this.angleUnit;
};

nfov.prototype.setOrientation = function setOrientation(orientation) {
  if (orientation === nfov.CLOCKWISE) {
    this.orientation = nfov.CLOCKWISE;
  } else if (orientation === nfov.COUNTERCLOCKWISE) {
    this.orientation = nfov.COUNTERCLOCKWISE;
  } else {
    throw new Error('Invalid value passed for `orientation`');
  }
};

nfov.prototype.getOrientation = function getOrientation() {
  return this.orientation;
};

nfov.prototype.setGrid = function setGrid(grid) {
  if (grid == null || Array.isArray(grid)) {
    this.grid = grid;
  } else {
    throw new Error('Invalid value passed for `grid`');
  }
};

nfov.prototype.getGrid = function getGrid() {
  return this.grid;
};

nfov.prototype.setTileSize = function setTileSize(widthOrObj, height) {
  if (widthOrObj > 0) {
    this.tileSize = {
      width: widthOrObj,
      height: height > 0 ? height : widthOrObj
    };
  } else if (widthOrObj != null && widthOrObj.width > 0 && widthOrObj.height > 0) {
    this.tileSize = {
      width: widthOrObj.width,
      height: widthOrObj.height
    };
  } else {
    throw new Error('Invalid value passed for `tileSize`');
  }
};

nfov.prototype.getTileSize = function getTileSize() {
  return this.tileSize;
};

nfov.prototype.setAcceptableTiles = function setAcceptableTiles(tiles) {
  if (Array.isArray(tiles)) {
    this.acceptableTiles = tiles.slice(0);
  } else if (tiles != null) {
    this.acceptableTiles = [tiles];
  } else {
    throw new Error('Invalid value passed for `tiles`');
  }
};

nfov.prototype.getAcceptableTiles = function getAcceptableTiles() {
  return this.acceptableTiles;
};

nfov.prototype.setHandler = function setHandler(handler) {
  if (typeof handler === 'function') {
    this.handler = handler;
  } else {
    throw new Error('Invalid value passed for `handler`');
  }
};

nfov.prototype.getHandler = function getHandler() {
  return this.handler;
};

nfov.prototype.detect = function detect(agents, targets, callback) {
  var handler = this.getHandler();
  handler(this, agents, targets, callback);
};

module.exports = nfov;

/***/ })
/******/ ]);
});
//# sourceMappingURL=nfov.js.map