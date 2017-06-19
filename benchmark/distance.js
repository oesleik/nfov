const NFOV = require('../dist/nfov')
const mocks = require('./mocks')

const nfov = new NFOV({
  distance: 300
})

module.exports = function getBenchmark (nPlayers, nObjects) {
  const players = mocks.getListPlayers(nPlayers)
  const objects = mocks.getListObjects(nObjects)

  return function () {
    nfov.detect(players, objects, function () {})
  }
}
