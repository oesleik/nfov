const extend = require('extend')
let uid = 0

module.exports = {
  addAgent (agent) {
    if (agent != null) {
      let _agent = extend(true, {}, this.defaults.agent, agent)

      if (_agent.id == null) {
        _agent.id = ++uid
      } else {
        // prevent duplication
        this.removeAgent(_agent.id)

        if (typeof _agent.id === 'number') {
          uid = _agent.id
        }
      }

      this._agents.push(_agent)
      return _agent.id
    }

    return null
  },

  getAgent (id) {
    return this._agents.find((agent) => agent.id === id) || null
  },

  getAllAgents () {
    return this._agents
  },

  removeAgent (id) {
    const index = this._agents.findIndex((agent) => agent.id === id)

    if (index >= 0) {
      this._agents.splice(index, 1)
    }
  }
}
