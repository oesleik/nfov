const assert = require('assert')
const NFOV = require('../src/index')

function getAgent (x, y) {
  return { x, y, width: 0, height: 0 }
}

function getTarget (x, y) {
  return { x, y, width: 0, height: 0, called: false }
}

function callback (agent, target) {
  target.called = true
}

describe('nfov distance', function () {
  it('should always call when distance is zero', function () {
    const agent = getAgent(50, 50)
    const target = getTarget(1000, 1000)

    const nfov = new NFOV({ distance: 0 })
    nfov.detect(agent, target, callback)
    assert.ok(target.called)
  })

  it('should call when target is on distance', function () {
    const agent = getAgent(100, 100)
    const targets = [
      getTarget(100, 100),
      getTarget(100, 0),
      getTarget(200, 100),
      getTarget(100, 200),
      getTarget(0, 100),
      getTarget(50, 50),
      getTarget(150, 50),
      getTarget(150, 150),
      getTarget(50, 150)
    ]

    const nfov = new NFOV({ distance: 100 })
    nfov.detect(agent, targets, callback)
    targets.forEach(function (target) { assert.ok(target.called) })
  })

  it('should not call when target is out of distance', function () {
    const agent = getAgent(150, 150)
    const targets = [
      getTarget(150, 0),
      getTarget(300, 150),
      getTarget(150, 300),
      getTarget(0, 150),
      getTarget(50, 50),
      getTarget(250, 50),
      getTarget(250, 250),
      getTarget(50, 250)
    ]

    const nfov = new NFOV({ distance: 100 })
    nfov.detect(agent, targets, callback)
    targets.forEach(function (target) { assert.ok(!target.called) })
  })
})
