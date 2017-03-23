const expect = require('chai').expect
const NFOV = require('../src/index')

describe('Target configurations', function () {
  const obj = new NFOV()

  describe('addTarget', function () {
    it('should add an target with the specific id', function () {
      expect(obj.addTarget({ id: 'addTest' })).to.equal('addTest')
    })

    it('should add an target with an automatic id', function () {
      expect(obj.addTarget({})).to.be.a('number')
    })

    it('should replace the previous target', function () {
      const id = obj.addTarget({ test: 1 })
      const length = obj.getAllTargets().length

      obj.addTarget({ id, test: 2 })
      expect(obj.getAllTargets().length).to.equal(length)

      expect(obj.getTarget(id).test).to.equal(2)
    })

    it('should not add any target', function () {
      expect(obj.addTarget()).to.be.null
    })
  })

  describe('getTarget', function () {
    it('should get an target by id', function () {
      const id = obj.addTarget({ test: 'get' })
      expect(obj.getTarget(id).test).to.equal('get')
    })

    it('should not get any target', function () {
      expect(obj.getTarget('getUndefined')).to.be.null
    })
  })

  describe('getAllTargets', function () {
    it('should be an array', function () {
      expect(obj.getAllTargets()).to.be.an('array')
    })

    it('should have a list of targets', function () {
      obj.addTarget()
      expect(obj.getAllTargets()).to.have.length.above(0)
    })
  })

  describe('removeTarget', function () {
    it('should remove an target by id', function () {
      const id = obj.addTarget({})

      const length = obj.getAllTargets().length
      obj.removeTarget(id)

      expect(obj.getTarget(id)).to.be.null
      expect(obj.getAllTargets().length).to.equal(length - 1)
    })

    it('should not remove any target', function () {
      obj.addTarget()

      const length = obj.getAllTargets().length
      obj.removeTarget()

      expect(obj.getAllTargets().length).to.equal(length)
    })
  })
})
