const assert = require('assert')
const NFOV = require('../src/index')

describe('nfov instance configuration', function () {
  it('should create with the default configurations', function () {
    const nfov = new NFOV()
    assert.equal(nfov.getDistance(), 0)
    assert.equal(nfov.getAngle(), 0)
    assert.equal(nfov.getMap(), null)
    assert.equal(typeof nfov.getHandler(), 'function')
  })

  it('should create with initial configurations', function () {
    const config = {
      distance: 100,
      angle: 360,
      map: [
        1, 1, 1,
        1, 0, 1,
        1, 1, 1
      ]
    }

    const nfov = new NFOV(config)
    assert.equal(nfov.getDistance(), config.distance)
    assert.equal(nfov.getAngle(), config.angle)
    assert.equal(nfov.getMap(), config.map)
  })

  it('should allow change the instance configurations', function () {
    const nfov = new NFOV()

    const config = {
      distance: 100,
      angle: 360,
      map: [
        1, 1, 1,
        1, 0, 1,
        1, 1, 1
      ]
    }

    nfov.setDistance(config.distance)
    assert.equal(nfov.getDistance(), config.distance)

    nfov.setAngle(config.angle)
    assert.equal(nfov.getAngle(), config.angle)

    nfov.setMap(config.map)
    assert.equal(nfov.getMap(), config.map)
  })

  it('should not allow invalid configuration values', function () {
    const nfov = new NFOV()

    assert.throws(() => nfov.setDistance())
    assert.throws(() => nfov.setDistance(-1))

    assert.throws(() => nfov.setAngle())
    assert.throws(() => nfov.setAngle(-1))

    assert.throws(() => nfov.setMap())

    assert.throws(() => nfov.setHandler())
    assert.throws(() => nfov.setHandler({}))
    assert.throws(() => nfov.setHandler('error'))
  })

  it('should not share configurations between instances', function () {
    const nfov1 = new NFOV({
      distance: 30,
      angle: 45,
      map: [
        1, 1, 1,
        1, 0, 1,
        1, 1, 1
      ]
    })

    const nfov2 = new NFOV({
      distance: 50,
      angle: 90,
      map: [
        1, 1, 1, 1,
        1, 0, 0, 1,
        1, 0, 0, 1,
        1, 1, 1, 1
      ]
    })

    assert.notEqual(nfov1.getDistance(), nfov2.getDistance())
    assert.notEqual(nfov1.getAngle(), nfov2.getAngle())
    assert.notEqual(nfov1.getMap(), nfov2.getMap())
  })
})
