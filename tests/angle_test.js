const assert = require('assert')
const NFOV = require('../src/index')

function deg2Rad (deg) {
  return (deg * Math.PI) / 180
}

function getAgent (x, y) {
  return { x, y, width: 0, height: 0, direction: 0 }
}

function getTarget (x, y) {
  return { x, y, width: 0, height: 0, called: false }
}

function callback (agent, target) {
  target.called = true
}

describe('nfov angle', function () {
  it('should always call when angle is zero', function () {
    const agent = getAgent(100, 100)
    const target = getTarget(50, 75)

    const nfov = new NFOV({ angle: 0 })
    nfov.detect(agent, target, callback)
    assert.ok(target.called)
  })

  it('should always call when angle is >= 360º', function () {
    const agent = getAgent(100, 100)
    const target = getTarget(50, 75)

    const nfov = new NFOV({ angle: deg2Rad(360) })
    nfov.detect(agent, target, callback)
    assert.ok(target.called)
  })

  it('should call when target is on fov', function () {
    const nfov = new NFOV({ angle: deg2Rad(90) })
    const agent = getAgent(100, 100)
    let targets

    agent.direction = 0
    targets = [
      getTarget(200, 100),
      getTarget(200, 0),
      getTarget(200, 200)
    ]

    nfov.detect(agent, targets, callback)
    targets.forEach(function (target) { assert.ok(target.called) })

    agent.direction = deg2Rad(90)
    targets = [
      getTarget(100, 200),
      getTarget(0, 200),
      getTarget(200, 200)
    ]

    nfov.detect(agent, targets, callback)
    targets.forEach(function (target) { assert.ok(target.called) })

    agent.direction = deg2Rad(180)
    targets = [
      getTarget(0, 100),
      getTarget(0, 0),
      getTarget(0, 200)
    ]

    nfov.detect(agent, targets, callback)
    targets.forEach(function (target) { assert.ok(target.called) })

    agent.direction = deg2Rad(270)
    targets = [
      getTarget(100, 0),
      getTarget(0, 0),
      getTarget(200, 0)
    ]

    nfov.detect(agent, targets, callback)
    targets.forEach(function (target) { assert.ok(target.called) })
  })

  it('should not call when target is out of fov', function () {
    const nfov = new NFOV({ angle: deg2Rad(89) })
    const agent = getAgent(100, 100)
    let targets

    agent.direction = 0
    targets = [
      getTarget(0, 100),
      getTarget(200, 0),
      getTarget(200, 200)
    ]

    nfov.detect(agent, targets, callback)
    targets.forEach(function (target) { assert.ok(!target.called) })

    agent.direction = deg2Rad(90)
    targets = [
      getTarget(100, 0),
      getTarget(0, 200),
      getTarget(200, 200)
    ]

    nfov.detect(agent, targets, callback)
    targets.forEach(function (target) { assert.ok(!target.called) })

    agent.direction = deg2Rad(180)
    targets = [
      getTarget(200, 100),
      getTarget(0, 0),
      getTarget(0, 200)
    ]

    nfov.detect(agent, targets, callback)
    targets.forEach(function (target) { assert.ok(!target.called) })

    agent.direction = deg2Rad(270)
    targets = [
      getTarget(100, 200),
      getTarget(0, 0),
      getTarget(200, 0)
    ]

    nfov.detect(agent, targets, callback)
    targets.forEach(function (target) { assert.ok(!target.called) })
  })
})
