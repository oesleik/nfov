const extend = require('extend')
let uid = 0

module.exports = {
  addTarget (target) {
    if (target != null) {
      let _target = extend(true, {}, this.defaults.target, target)

      if (_target.id == null) {
        _target.id = ++uid
      } else {
        // prevent duplication
        this.removeTarget(_target.id)

        if (typeof _target.id === 'number') {
          uid = _target.id
        }
      }

      this._targets.push(_target)
      return _target.id
    }

    return null
  },

  getTarget (id) {
    return this._targets.find((target) => target.id === id) || null
  },

  getAllTargets () {
    return this._targets
  },

  removeTarget (id) {
    const index = this._targets.findIndex((target) => target.id === id)

    if (index >= 0) {
      this._targets.splice(index, 1)
    }
  }
}
