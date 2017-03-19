function nfov(config) {
  if (!this instanceof nfov) {
    return new nfov(config);
  }

  if (config != null) {
    if (config.agents != null) {
      this.removeAgents('*');
      config.agents.forEach((agent) => this.addAgent(agent));
    }

    if (config.targets != null) {
      this.removeTargets('*');
      config.targets.forEach((target) => this.addTarget(target));
    }

    if (config.map != null) {
      this.setMap(map);
    }
  }
}

nfov.prototype.addAgent = function addAgent() {
  // code...
}

nfov.prototype.getAgent = function getAgent() {
  // code...
}

nfov.prototype.removeAgent = function removeAgent() {
  // code...
}

nfov.prototype.removeAgents = function removeAgents() {
  // code...
}

nfov.prototype.addTarget = function addTarget() {
  // code...
}

nfov.prototype.getTarget = function getTarget() {
  // code...
}

nfov.prototype.removeTarget = function removeTarget() {
  // code...
}

nfov.prototype.removeTargets = function removeTargets() {
  // code...
}

nfov.prototype.setMap = function setMap() {
  // code...
}

nfov.prototype.tick = function tick() {
  // code...
}

module.exports = nfov;