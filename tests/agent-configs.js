const expect = require('chai').expect
const NFOV = require('../src/index')

describe('Agent configurations', function () {
  const obj = new NFOV()

  describe('addAgent', function () {
    it('should add an agent with the specific id', function () {
      expect(obj.addAgent({ id: 'addTest' })).to.equal('addTest')
    })

    it('should add an agent with an automatic id', function () {
      expect(obj.addAgent({})).to.be.a('number')
    })

    it('should replace the previous agent', function () {
      const id = obj.addAgent({ test: 1 })
      const length = obj.getAllAgents().length

      obj.addAgent({ id, test: 2 })
      expect(obj.getAllAgents().length).to.equal(length)

      expect(obj.getAgent(id).test).to.equal(2)
    })

    it('should not add any agent', function () {
      expect(obj.addAgent()).to.be.null
    })
  })

  describe('getAgent', function () {
    it('should get an agent by id', function () {
      const id = obj.addAgent({ test: 'get' })
      expect(obj.getAgent(id).test).to.equal('get')
    })

    it('should not get any agent', function () {
      expect(obj.getAgent('getUndefined')).to.be.null
    })
  })

  describe('getAllAgents', function () {
    it('should be an array', function () {
      expect(obj.getAllAgents()).to.be.an('array')
    })

    it('should have a list of agents', function () {
      obj.addAgent()
      expect(obj.getAllAgents()).to.have.length.above(0)
    })
  })

  describe('removeAgent', function () {
    it('should remove an agent by id', function () {
      const id = obj.addAgent({})

      const length = obj.getAllAgents().length
      obj.removeAgent(id)

      expect(obj.getAgent(id)).to.be.null
      expect(obj.getAllAgents().length).to.equal(length - 1)
    })

    it('should not remove any agent', function () {
      obj.addAgent()

      const length = obj.getAllAgents().length
      obj.removeAgent()

      expect(obj.getAllAgents().length).to.equal(length)
    })
  })
})
